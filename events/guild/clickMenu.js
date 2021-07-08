const Widgets = require("../../modules/provider");

module.exports = async (client, menu) => {
    if (menu.id === 'dr') Widgets.MenuRole.dropclick(client, menu);
    if (menu.id === 'xprl') Widgets.MenuRolesXP.dropclick(client, menu);
}