//I have objects which need to be tracked
//Header, Footer, Home page, App page, Checkout page
//Header includes logo, link to sections
//Footer includes logo, link to social media
//Home page includes many buttons, links, images
//App page includes many buttons, links, images
//Checkout page includes many buttons, links, images
//I need to track the following events:
//Click on logo in Header
//Click on links in Header
//Click on links in Footer
//Click on buttons in Home page
//Click on links in Home page
//Click on buttons in App page
//Click on links in App page
//Click on buttons in Checkout page
//Click on links in Checkout page
function clickToSelectTemplateOnDesignApp(templateId) {
    window.dataLayer.push({
        event: 'select_template',
        template_id: templateId
    });
}
function clickToCloseSelectingTemplateOnDesignApp() {
    window.dataLayer.push({
        event: 'close_selecting_template'
    });
}
function clickToSelectBlankTemplateOnDesignApp() {
    window.dataLayer.push({
        event: 'select_blank_template'
    });
}
function clickToOpenSelectingTextureOnDesignApp() {
    window.dataLayer.push({
        event: 'open_selecting_texture'
    });
}
function clickToSelectTextureOnDesignApp(textureId) {
    window.dataLayer.push({
        event: 'select_texture',
        texture_id: textureId
    });
}
function clickPressToDrawOnDesignApp(textureId, size, degree) {
    window.dataLayer.push({
        event: 'press_to_draw',
        texture_id: textureId,
        size: size,
        degree: degree,
    });
}
function clickToOpenSelectingTemplateOnDesignApp() {
    window.dataLayer.push({
        event: 'open_selecting_template'
    });
}
function clickToResizeTextureOnDesignApp(textureId, size) {
    window.dataLayer.push({
        event: 'resize_texture',
        texture_id: textureId,
        size: size,
    });
}
function clickToRotateTextureOnDesignApp(textureId, degree) {
    window.dataLayer.push({
        event: 'rotate_texture',
        texture_id: textureId,
        degree: degree,
    });
}
function clickToRemoveTextureOnDesignApp(textureId) {
    window.dataLayer.push({
        event: 'remove_texture',
        texture_id: textureId
    });
}
function clickToRemoveAllTextureOnDesignApp() {
    window.dataLayer.push({
        event: 'remove_all_texture'
    });
}
function clickToSaveDesignOnDesignApp() {
    window.dataLayer.push({
        event: 'save_design'
    });
}
function clickToSaveAndOrderOnDesignApp() {
    window.dataLayer.push({
        event: 'save_and_order'
    });
}
function clickToSelectTextureTypeOnDesignApp(textureType) {
    window.dataLayer.push({
        event: 'select_texture_type',
        texture_type: textureType
    });
}

export default {
    clickToSelectTemplateOnDesignApp,
    clickToCloseSelectingTemplateOnDesignApp,
    clickToSelectBlankTemplateOnDesignApp,
    clickToOpenSelectingTextureOnDesignApp,
    clickToSelectTextureOnDesignApp,
    clickPressToDrawOnDesignApp,
    clickToOpenSelectingTemplateOnDesignApp,
    clickToResizeTextureOnDesignApp,
    clickToRotateTextureOnDesignApp,
    clickToRemoveTextureOnDesignApp,
    clickToRemoveAllTextureOnDesignApp,
    clickToSaveDesignOnDesignApp,
    clickToSaveAndOrderOnDesignApp,
    clickToSelectTextureTypeOnDesignApp,
}