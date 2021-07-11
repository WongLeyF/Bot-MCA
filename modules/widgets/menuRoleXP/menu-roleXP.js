const { MessageEmbed } = require("discord.js");
const { delay } = require("../../../handlers/functions");
const { getRole, noXpRoles } = require("../../../handlers/mongo/controllers");

class main {
		static async dropclick(client, menu) {
		if (!client) throw new Error('Menu Roles: client not provided');
		if (!menu) throw new Error('Menu Roles: button not provided');
		await menu.clicker.fetch();
		if (menu.id == 'xprl') {
			let member;
			const fetchMem = await menu.guild.members.fetch(menu.clicker.member.id, false);
			if (fetchMem) member = menu.guild.members.cache.get(menu.clicker.member.id);
			await member.fetch(true);
			const role = await getRole(menu, menu.values[0])
			const command = client.commands.get('noxprole')
			if (command.memberpermissions && !member.hasPermission(command.memberpermissions)) {
				return menu.reply.send(new MessageEmbed()
					.setColor('RED')
					.setDescription(`❌ No puedes usar este comando, necesitas estos permisos: \`${command.memberpermissions.join("`, `")}\``)
					, true).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log("Couldn't Delete --> Ignore".gray)));
			} else if (role) {
				if (noXpRoles(menu, role, 'remove')) {
					await delay(2000)
					menu.reply.send(`Acabo de eliminar el rol ${role} de la lista!`, true);
					menu.message.delete()
					command.run(client, menu, ['list'])
				}
			}
		}
	}
}
module.exports = main;
