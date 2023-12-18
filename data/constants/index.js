import { TwoCategoryBlock } from "../../components/cms"
import { ThreeCategoryBlock } from "../../components/cms"
import { ProductCardCarousal } from "../../components/cms"
import { BannerImageWithContentBlock } from "../../components/cms"
import { BrandCardContainer } from "../../components/cms"
import { Banner } from "../../components/cms"
import { Heading } from "../../components/cms"
import { SubCategoryCards } from "../../components/cms"
import { InfoSlider } from "../../components/cms"
import { ImageCardCarousal } from "../../components/cms"

export const layoutToComponent = {
    "two-category-block": TwoCategoryBlock,
    "three-category-block": ThreeCategoryBlock,
    "product-card-carousel": ProductCardCarousal,
    "banner-content": BannerImageWithContentBlock,
    "brand-card-carousel": BrandCardContainer,
    "banner": Banner,
    "image-card-carousel": ImageCardCarousal,
    "heading": Heading,
    "sub-category-container": SubCategoryCards,
    "info-banner-carousel": InfoSlider,
}