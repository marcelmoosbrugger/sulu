<?php

/*
 * This file is part of Sulu.
 *
 * (c) MASSIVE ART WebServices GmbH
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */

namespace Sulu\Bundle\MediaBundle\DependencyInjection;

use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Reference;

/**
 * Compiler pass for collecting services tagged with sulu_media.image.transformation.
 */
class ImageTransformationCompilerPass implements CompilerPassInterface
{
    /**
     * {@inheritdoc}
     */
    public function process(ContainerBuilder $container)
    {
        if (!$container->hasDefinition('sulu_media.image.transformation_manager')) {
            return;
        }

        $definition = $container->getDefinition('sulu_media.image.transformation_manager');
        $taggedServices = $container->findTaggedServiceIds('sulu_media.image.transformation');

        foreach ($taggedServices as $id => $tags) {
            foreach ($tags as $attributes) {
                $definition->addMethodCall(
                    'add',
                    [new Reference($id), $attributes['alias']]
                );
            }
        }
    }
}
