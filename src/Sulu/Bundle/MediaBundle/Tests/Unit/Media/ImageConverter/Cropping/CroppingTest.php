<?php

/*
 * This file is part of Sulu.
 *
 * (c) MASSIVE ART WebServices GmbH
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */

namespace Sulu\Bundle\MediaBundle\Tests\Unit\Media\ImageConverter\Cropping;

use Imagine\Gd\Imagine;
use Imagine\Image\Box;
use Sulu\Bundle\MediaBundle\Media\ImageConverter\Cropping\Cropping;
use Sulu\Bundle\MediaBundle\Media\ImageConverter\Cropping\CroppingInterface;
use Sulu\Bundle\TestBundle\Testing\SuluTestCase;

class CroppingTest extends SuluTestCase
{
    /**
     * @var CroppingInterface
     */
    private $cropping;

    public function setUp()
    {
        parent::setUp();
        $this->cropping = new Cropping();
    }

    public function testCrop()
    {
        $imagine = new Imagine();
        $imageBox = new Box(1000, 500);
        $image = $imagine->create($imageBox);

        $image = $this->cropping->crop($image, 10, 10, 50, 100);

        $this->assertEquals(50, $image->getSize()->getWidth());
        $this->assertEquals(100, $image->getSize()->getHeight());
    }

    public function testValid()
    {
        $imagine = new Imagine();
        $imageBox = new Box(1000, 500);
        $image = $imagine->create($imageBox);

        $format = [
            'scale' => [
                'x' => 300,
                'y' => 200,
            ],
        ];
        $valid = $this->cropping->isValid($image, 10, 20, 600, 400, $format);

        $this->assertTrue($valid);
    }

    public function testValidWithOneDimension()
    {
        $imagine = new Imagine();
        $imageBox = new Box(1000, 500);
        $image = $imagine->create($imageBox);

        $format = [
            'scale' => [
                'x' => 300,
            ],
        ];

        $valid = $this->cropping->isValid($image, 10, 0, 600, 500, $format);
        $this->assertTrue($valid);

        $valid = $this->cropping->isValid($image, 10, 20, 600, 20, $format);
        $this->assertTrue($valid);
    }

    public function testValidSameSize()
    {
        $imagine = new Imagine();
        $imageBox = new Box(1000, 500);
        $image = $imagine->create($imageBox);

        $format = [
            'scale' => [
                'x' => 300,
                'y' => 200,
            ],
        ];
        $valid = $this->cropping->isValid($image, 10, 20, 300, 200, $format);

        $this->assertTrue($valid);
    }

    public function testNotValidTooSmall()
    {
        $imagine = new Imagine();
        $imageBox = new Box(1000, 500);
        $image = $imagine->create($imageBox);

        $format = [
            'scale' => [
                'x' => 300,
                'y' => 200,
            ],
        ];
        $valid = $this->cropping->isValid($image, 10, 20, 150, 100, $format);

        $this->assertFalse($valid);
    }

    public function testNotValidExceedX()
    {
        $imagine = new Imagine();
        $imageBox = new Box(1000, 500);
        $image = $imagine->create($imageBox);

        $format = [
            'scale' => [
                'x' => 300,
                'y' => 200,
            ],
        ];
        $valid = $this->cropping->isValid($image, 500, 20, 600, 400, $format);

        $this->assertFalse($valid);
    }

    public function testNotValidExceedY()
    {
        $imagine = new Imagine();
        $imageBox = new Box(1000, 500);
        $image = $imagine->create($imageBox);

        $format = [
            'scale' => [
                'x' => 300,
                'y' => 200,
            ],
        ];
        $valid = $this->cropping->isValid($image, 10, 200, 600, 400, $format);

        $this->assertFalse($valid);
    }
}
