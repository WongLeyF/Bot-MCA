class main {
	static async buttonclick(client, button) {
		if (!client) throw new Error('Menu Roles: client not provided');
		if (!button) throw new Error('Menu Roles: button not provided');
		await button.clicker.fetch();
		const id = button.id;
		if (button.id.startsWith('br')) {
			let member;
			const fetchMem = await button.guild.members.fetch(button.clicker.member.id, false);
			if (fetchMem) member = button.guild.members.cache.get(button.clicker.member.id);
			await member.fetch(true);
			const role = id.split(':')[1];
			console.log(button.clicker.member.roles.cache.has(role))
			if (button.clicker.member.roles.cache.has(role)) {
				button.clicker.member.roles.remove(role);
				button.reply.send(`Te acabo de quitar el role <@&${role}> !`, true);
			}
			else {
				button.clicker.member.roles.add(role);
				button.reply.send(`Te acabo de agregar el role <@&${role}> !`, true);
			}
		}
	}
	static async dropclick(client, menu) {
		if (!client) throw new Error('Menu Roles: client not provided');
		if (!menu) throw new Error('Menu Roles: button not provided');
		await menu.clicker.fetch();
		if(menu.id == 'dr') {
			let member;
			const fetchMem = await menu.guild.members.fetch(menu.clicker.member.id, false);
			if (fetchMem) member = menu.guild.members.cache.get(menu.clicker.member.id);
			await member.fetch(true);
			const role = menu.values[0];
			if (menu.clicker.member.roles.cache.has(role)) {
				menu.clicker.member.roles.remove(role);
				menu.reply.send(`Te acabo de quitar el role <@&${role}> !`, true);
			}
			else {
				menu.clicker.member.roles.add(role);
				menu.reply.send(`Te acabo de agregar el role <@&${role}> !`, true);
			}
		}
	}
}
module.exports = main;
