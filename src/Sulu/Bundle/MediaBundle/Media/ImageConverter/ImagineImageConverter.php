<?php

/*
 * This file is part of Sulu.
 *
 * (c) MASSIVE ART WebServices GmbH
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */

namespace Sulu\Bundle\MediaBundle\Media\ImageConverter;

use Imagine\Gd\Imagine as GdImagine;
use Imagine\Image\ImageInterface;
use Imagine\Image\Palette\RGB;
use Imagine\Imagick\Imagine;
use Imagine\Imagick\Imagine as ImagickImagine;
use RuntimeException;
use Sulu\Bundle\MediaBundle\Media\Exception\ImageProxyInvalidFormatOptionsException;
use Sulu\Bundle\MediaBundle\Media\Exception\ImageProxyMediaNotFoundException;
use Sulu\Bundle\MediaBundle\Media\Exception\InvalidFileTypeException;
use Sulu\Bundle\MediaBundle\Media\ImageConverter\Scaling\ScalingInterface;

/**
 * Sulu imagine converter for media.
 */
class ImagineImageConverter implements ImageConverterInterface
{
    /**
     * @var TransformationPoolInterface
     */
    private $transformationPool;

    /**
     * @var ScalingInterface
     */
    private $scaling;

    /**
     * @param TransformationPoolInterface $transformationManager
     * @param ScalingInterface $scaling
     */
    public function __construct(
        TransformationPoolInterface $transformationManager,
        ScalingInterface $scaling
    ) {
        $this->transformationPool = $transformationManager;
        $this->scaling = $scaling;
    }

    /**
     * {@inheritdoc}
     */
    public function convert($originalPath, array $format)
    {
        $imagine = $this->newImage();
        $image = null;

        try {
            $image = $imagine->open($originalPath);
        } catch (\RuntimeException $e) {
            if (file_exists($originalPath)) {
                throw new InvalidFileTypeException($e->getMessage());
            }
            throw new ImageProxyMediaNotFoundException($e->getMessage());
        }

        $image = $this->toRGB($image);

        if (isset($format['scale'])) {
            $image = $this->applyScale($image, $format['scale']);
        }
        if (isset($format['transformations'])) {
            $image = $this->applyTransformations($image, $format['transformations']);
        }

        return $image;
    }

    /**
     * Creates a new image.
     *
     * @return ImageInterface
     */
    private function newImage()
    {
        try {
            return new ImagickImagine();
        } catch (RuntimeException $ex) {
            return new GdImagine();
        }
    }

    /**
     * Applies an array of transformations on a passed image.
     *
     * @param ImageInterface $image
     * @param $tansformations
     *
     * @throws ImageProxyInvalidFormatOptionsException
     *
     * @return ImageInterface The modified image
     */
    private function applyTransformations(ImageInterface $image, $tansformations)
    {
        foreach ($tansformations as $transformation) {
            if (!isset($transformation['effect'])) {
                throw new ImageProxyInvalidFormatOptionsException('Effect not found');
            }
            $image = $this->modifyAllLayers(
                $image,
                function (ImageInterface $layer) use ($transformation) {
                    return $this->transformationPool->get($transformation['effect'])->execute(
                        $layer,
                        $transformation['parameters']
                    );
                }
            );
        }

        return $image;
    }

    /**
     * Scales a given image according to the information passed as the second argument.
     *
     * @param ImageInterface $image
     * @param $scale
     *
     * @return ImageInterface
     */
    private function applyScale(ImageInterface $image, $scale)
    {
        return $this->modifyAllLayers(
            $image,
            function (ImageInterface $layer) use ($scale) {
                return $this->scaling->scale(
                    $layer,
                    $scale['x'],
                    $scale['y'],
                    $scale['mode'],
                    $scale['forceRatio'],
                    $scale['retina']
                );
            }
        );
    }

    /**
     * Ensures that the color mode of the passed image is RGB.
     *
     * @param ImageInterface $image
     *
     * @return ImageInterface $image The modified image
     */
    private function toRGB(ImageInterface $image)
    {
        if ($image->palette()->name() == 'cmyk') {
            $image->usePalette(new RGB());
        }

        return $image;
    }

    /**
     * Applies a callback to every layer of an image and returns the resulting image.
     *
     * @param ImageInterface $image
     * @param callable $modifier The callable to apply to all layers
     *
     * @return ImageInterface
     */
    private function modifyAllLayers(ImageInterface $image, callable $modifier)
    {
        if (count($image->layers())) {
            $countLayer = 0;
            $image->layers()->coalesce();

            /** @var ImageInterface $temporaryImage */
            $temporaryImage = null;
            foreach ($image->layers() as $layer) {
                $countLayer += 1;
                $layer = call_user_func($modifier, $layer);
                if ($countLayer == 1) {
                    $temporaryImage = $layer; // use first layer as main image
                } else {
                    $temporaryImage->layers()->add($layer);
                }
            }
            $image = $temporaryImage;
        } else {
            $image = call_user_func($modifier, $image);
        }

        return $image;
    }
}
