<?php

namespace Sulu\Component\Content\Metadata\Loader;

class XmlLoaderTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var XmlLoader
     */
    private $loader;

    public function setUp()
    {
        $this->loader = new XmlLoader();
    }

    public function testLoadTemplate()
    {
        $result = $this->load('template.xml');
    }

    public function testLoadBlockMetaTitles()
    {
        $result = $this->load('template_block_types.xml');

        $blockTypes = $result->getProperty('block1')->getComponents();

        $this->assertEquals('Default DE', $blockTypes[0]->getTitle('de'));
        $this->assertEquals('Default EN', $blockTypes[0]->getTitle('en'));
        $this->assertEquals('Test DE', $blockTypes[1]->getTitle('de'));
        $this->assertEquals('Test EN', $blockTypes[1]->getTitle('en'));

        // TODO also check info_text and placeholder (or are they not necessary at all?)
    }

    private function load($name)
    {
        $result = $this->loader->load(
            __DIR__ . '/../../../../../Resources/DataFixtures/Page/' . $name
        );

        return $result;
    }
}
