// @flow
import type {OverlayListDimensions, OverlayListStyle, VerticalCrop} from './types';

const MIN_HEIGHT = 100;
const PADDING_TO_WINDOW = 10;
const LEFT_OFFSET = -20;
const TOP_OFFSET = 2;

/**
 * The class is responsible for calculating the position of the overlay-list on the screen when opened.
 * Generally, it positions the list above an anchor element. Moreover the list is shifted, such that
 * a designated element in the list is right above the anchor element.
 * It is made sure that the list does not overflow the borders of the screen and even keeps a padding to the borders.
 *
 * The behaviour described to this point, however, is broken at one point: When the height of the list undercuts
 * a certain minimum height, the list is positioned from the anchor element upwards or downwards depending on if
 * the list overflows the bottom or top border of the screen.
 */
export default class OverlayListPositioner {
    listHeight: number;
    listWidth: number;
    centeredChildRelativeTop: number;

    anchorTop: number;
    anchorLeft: number;
    anchorWidth: number;
    anchorHeight: number;

    windowWidth: number;
    windowHeight: number;

    constructor(
        listHeight: number,
        listWidth: number,
        centeredChildRelativeTop: number,
        anchorTop: number,
        anchorLeft: number,
        anchorWidth: number,
        anchorHeight: number,
        windowWidth: number = window.innerWidth,
        windowHeight: number = window.innerHeight,
    ) {
        this.listHeight = listHeight;
        this.listWidth = listWidth;
        this.centeredChildRelativeTop = centeredChildRelativeTop;
        this.anchorTop = anchorTop;
        this.anchorLeft = anchorLeft;
        this.anchorWidth = anchorWidth;
        this.anchorHeight = anchorHeight;
        this.windowWidth = windowWidth;
        this.windowHeight = windowHeight;
    }

    static dimensionsToStyle(dimensions: OverlayListDimensions): OverlayListStyle {
        return {
            top: dimensions.top + 'px',
            height: dimensions.height + 'px',
            left: dimensions.left + 'px',
        };
    }

    getCroppedDimensions(): OverlayListDimensions {
        // First, the list is positioned without taking the screen borders or the minimum height into account.
        let dimensions = {
            top: this.anchorTop - this.centeredChildRelativeTop + TOP_OFFSET,
            left: this.anchorLeft + LEFT_OFFSET,
            height: this.listHeight,
            scrollTop: 0,
        };
        let crop = this.cropVerticalDimensions(dimensions);
        // If after making sure, the list does not overflow the top and the bottom border of the screen, the
        // list succeeds the minimum height, no more steps have to be taken.
        if (crop.dimensions.height >= MIN_HEIGHT) {
            return this.cropHorizontalDimensions(crop.dimensions);
        }

        // If the minimum height is undercut and the top border of the screen is touched, the list gets
        // positioned from the anchor downwards.
        if (crop.touchesTopBorder) {
            dimensions.top = this.anchorTop + TOP_OFFSET;
        }
        // If the bottom border is touched, it gets positioned from the anchor upwards.
        if (crop.touchesBottomBorder) {
            dimensions.top = this.anchorTop + this.anchorHeight - this.listHeight - TOP_OFFSET;
        }

        // After moving the list it has to be made sure one more time that the list does not overflow the borders.
        crop = this.cropVerticalDimensions(dimensions);
        return this.cropHorizontalDimensions(crop.dimensions);
    }

    cropVerticalDimensions(dimensions: OverlayListDimensions): VerticalCrop {
        let newDimensions = {...dimensions};
        let touchesTopBorder = false;
        let touchesBottomBorder = false;

        if (dimensions.top < PADDING_TO_WINDOW) {
            newDimensions.top = PADDING_TO_WINDOW;
            newDimensions.height = dimensions.height + dimensions.top - PADDING_TO_WINDOW;
            newDimensions.scrollTop = -dimensions.top + PADDING_TO_WINDOW;
            touchesTopBorder = true;
        }
        if (newDimensions.top + newDimensions.height > this.windowHeight - PADDING_TO_WINDOW) {
            newDimensions.height = this.windowHeight - newDimensions.top - PADDING_TO_WINDOW;
            touchesBottomBorder = true;
        }

        return {dimensions: newDimensions, touchesTopBorder, touchesBottomBorder};
    }

    cropHorizontalDimensions(dimensions: OverlayListDimensions): OverlayListDimensions {
        let newDimensions = {...dimensions};
        newDimensions.left = Math.max(PADDING_TO_WINDOW, newDimensions.left);
        newDimensions.left = Math.min(this.windowWidth - this.listWidth - PADDING_TO_WINDOW, newDimensions.left);

        return newDimensions;
    }
}
