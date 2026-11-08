export type SeedPost = {
  section: 'blog' | 'guides' | 'updates';
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  authorSlug: 'andrew' | 'ivy' | 'burrow-team';
  game?: string;
  difficulty?: 'starter' | 'intermediate' | 'advanced';
  body: string;
};

export const SEED_POSTS: SeedPost[] = [
  {
    section: 'blog',
    title: 'Welcome to The Warren',
    slug: 'welcome-to-the-warren',
    excerpt:
      'This is where Burrow will post guides, product updates, and the occasional story from building a game server company with your friends in mind.',
    tags: ['burrow', 'news'],
    authorSlug: 'burrow-team',
    body: `## A little corner of Burrow

Welcome to The Warren. This is Burrow's blog, the place we will write things down instead of scattering them across social posts that disappear in a day. If you run a game server with friends, or you are thinking about starting one, this is written for you.

## Who we are

Burrow is a small game server hosting company run by three people in Texas: Andrew, Dakota, and ivy. We built Burrow around a simple idea. A group of friends should be able to run a server together, split the cost fairly, and pay less when nobody is playing. Servers cost $3 per GB of RAM, flat. When your group takes a break, the server can sleep for $1 a month instead of billing you for an empty world.

That is the whole pitch. No tiers named after precious metals, no checkout maze, no bill landing on one generous friend every month.

## What you will find here

The Warren has three sections, and we plan to keep them tidy.

**Blog.** Stories and plain talk. Why we price things the way we do, what we are learning from running servers for groups, and the math behind splitting a server with friends.

**Guides.** Step by step help for the games we support, starting with Minecraft and growing to Valheim, Project Zomboid, Rust, and Arma Reforger. Guides will say what plan size you actually need, not the biggest one we could sell you, and each one carries a last verified date so you know it is current.

**Updates.** Short, honest changelog posts. What shipped, what changed, what broke and got fixed. If something affects your server, it will show up here in plain language.

## How often we will post

We would rather set a modest bar and clear it. Expect a guide or a post most weeks, and an update post whenever something real ships. Some weeks will be quiet because we are busy keeping servers running, and that trade is the right one. Quality over volume, every time.

## Come say hi

The fastest way to reach us is the Burrow Discord at discord.gg/xchUdWNbuv. That is where players ask questions, suggest games, and tell us what their group is building. If you want to start a server, the main site is burrowservers.com, where you can see the panel and the pricing without signing up for anything.

Thanks for digging in with us. First guide is already up, and it is the one most groups need: how to start a Minecraft server for your friend group and split the bill without anyone fronting the whole thing.`,
  },
  {
    section: 'guides',
    title: 'Start a Minecraft server for your friend group and split the bill',
    slug: 'minecraft-server-for-your-friend-group',
    excerpt:
      'Pick the right size, create the server, invite your friends, and let everyone pay their own share. Nobody has to front the whole bill ever again.',
    tags: ['minecraft', 'getting-started'],
    authorSlug: 'ivy',
    game: 'Minecraft',
    difficulty: 'starter',
    body: `## The way this usually goes wrong

Almost every friend group has the same story. One person rents a server, pays the full bill every month, and slowly becomes the only one who cares whether it stays online. Then they stop paying, the world vanishes, and the group chat goes quiet. Burrow is built to skip that story. This guide walks through starting a Minecraft server where the cost is shared from day one.

## Step 1: pick your RAM

Burrow charges $3 per GB of RAM, flat, so sizing is just choosing your RAM.

- **2 GB** suits a small vanilla group, roughly two to five players exploring, building, and fighting the occasional creeper. At $3 per GB that is $6 a month, total.
- **4 GB** is the comfortable pick for a bigger group or a modded run. Modpacks, extra plugins, and busy farms all eat memory. That is $12 a month, total.

If you are unsure, start at 2 GB. You can move up later, and a small server that gets played beats a big one nobody uses. Paper or Purpur instead of plain vanilla also stretches a small plan further, since both are easier on RAM.

## Step 2: create the server

On burrowservers.com, create a server, pick Minecraft, choose your RAM, and name it something your group will recognize. The panel sets up the current Minecraft version for you. When it is ready, you will see the server address in the panel. That address is all anyone needs to connect, exactly like joining any other Minecraft server from the multiplayer menu.

Before you invite everyone, hop in yourself once. Spawn, look around, confirm the world generated. Two minutes of checking now saves a group chat full of "is it just me" later.

## Step 3: invite your friends

Send the server address to your group and add your friends to the server in the panel. This step matters more than it looks, because being added is what connects each friend to the billing split. A friend who is only whitelisted inside Minecraft can play, but a friend added in the panel can also pay their share, see the server status, and help run it.

## Step 4: split the bill

Here is the part Burrow exists for. When the server renews, each person on it pays their own share instead of one person fronting the whole amount. Four friends on a 4 GB server pay $3 each. Five friends on a 2 GB server pay $1.20 each. The math is just the plan price divided by the group, handled in the panel, with each person's card charged only for their part.

Nobody is chasing anyone for five dollars in a group chat. Nobody quietly resents paying for a server three other people play on. If a friend leaves the group, remove them from the server and the split adjusts for the people who stay.

## Step 5: sleep it when life happens

Groups have seasons. Exams, new jobs, a different game taking over for a month. When nobody is playing, put the server to sleep from the panel or from Discord. A sleeping server costs $1 a month, and your world, settings, and files stay exactly as you left them. The full guide to sleeping is its own post here in the guides section, and it is worth a read before your first break.

When someone gets the itch again, wake the server. It takes a short moment to come back, and then your world is right where you left it, half finished castle and all.

## A note on backups

Burrow keeps regular backups of your server, and you can restore from the panel if a build goes sideways or a mod eats your world. Backups are the boring feature nobody thinks about until the day they matter, and then they are the only feature that matters. Sleep well, literally, knowing your world is not one bad afternoon away from gone.

## Your first evening

That is the whole flow: pick a size, create the server, add your friends, split the bill, and sleep it when the group rests. If you get stuck at any step, the Burrow Discord at discord.gg/xchUdWNbuv is full of people doing the same thing, and the three of us are in there too.`,
  },
  {
    section: 'guides',
    title: 'Sleeping a server, explained: what it does and when to use it',
    slug: 'sleeping-a-server-explained',
    excerpt:
      'Sleeping stops your server and drops the price to $1 a month while keeping your world and settings exactly as you left them. Here is when to use it.',
    tags: ['minecraft', 'sleep', 'how-it-works'],
    authorSlug: 'ivy',
    game: 'Minecraft',
    difficulty: 'starter',
    body: `## The short version

Sleeping a server means the server stops running and the price drops to $1 a month. Your world, your settings, your plugins, your files, all of it stays saved and untouched. When you wake the server, everything comes back the way you left it. Think of it like pausing a game for the whole group, except the pause also pauses most of the bill.

## What sleep actually does

When you sleep a server on Burrow, three things happen. The running server process stops, so nobody can connect while it is asleep. The full state of the server is kept in storage, world files and configuration included. And billing switches to the sleep price, $1 a month, instead of the normal $3 per GB.

That is all. There is no export step, no downloading your world to your own computer, no race to back things up before a deadline. The server is simply off, safely, at a price that matches the fact that nobody is playing on it.

## What sleep is not

Sleeping is not deleting. A deleted server is gone. A sleeping server is parked.

Sleeping is not a wipe. Your builds, chests, farms, and half finished projects are preserved to the block. Your whitelist, your difficulty setting, that one gamerule your group argued about for an hour, all preserved.

Sleeping is also not a punishment for being inactive. We will never sleep your server behind your back, and we will never delete a sleeping server for sitting too long. Sleep is a tool you control, on your schedule.

## Waking up

Waking a server takes a moment, not minutes. The server starts, loads the world, and is ready to join, usually before you have finished telling the group chat it is back. Anyone on the server's member list can wake it, so the first person who feels like playing on a Friday night does not have to wait for the server's creator to be online.

There are two ways to do it. In the panel, open your server and press the wake button. In Discord, use the /wake command, and use /sleep the same way when the session is over. The Discord commands also include /start, /stop, and /status, so your group can run the server from the chat you are already in.

## Good times to sleep a server

**Between seasons.** Many groups play in bursts, a big world for two months, then a break. Sleep the server at the end of a season instead of paying full price for an empty world or deleting it in a moment of tidiness you will regret.

**Exam weeks and busy stretches.** When school or work eats everyone's evenings, sleep the server and stop thinking about it. $1 a month is cheaper than the group chat debate about whether to cancel.

**When another game takes over.** It happens to every group. A new release lands and Minecraft goes quiet for a while. Sleep the server, go play the new thing, and wake your world when the group drifts back. It will be waiting.

**For a second server you rarely use.** A creative test world, a hardcore attempt that sees action twice a month. If it is mostly off, it should mostly cost like it is off.

## The math, because it is the point

A 4 GB server costs $12 a month awake. Asleep, it costs $1. A group that plays eight months a year and sleeps the other four pays for a year of their world in a way that matches how they actually play, instead of donating four months of rent to an empty map. Split that sleep dollar among four friends and the break costs each person a quarter. That is the idea Burrow is built on: pay for playing, not for remembering to cancel.`,
  },
  {
    section: 'updates',
    title: 'Update: The Warren is live',
    slug: 'the-warren-is-live',
    excerpt:
      'Burrow has a blog now. We built our own tiny CMS to run it, and this is where guides and updates will live from here on.',
    tags: ['changelog'],
    authorSlug: 'andrew',
    body: `## We have a blog now

The Warren is live. This is where Burrow guides, product updates, and changelog posts will live from here on, starting today.

## What shipped

- A public site with three sections: blog, guides, and updates
- A small admin for the team to write and publish posts
- Our first two guides: starting a Minecraft server for a friend group, and how sleeping a server works
- RSS feeds, if you still roll that way (we do)

## Why we built our own

We looked at off the shelf CMS tools, and even ran one for an evening. They were fine, and they were also huge: plugin systems, translation engines, and a separate platform our website would have had to call home to for every post. Burrow is a small company, so we wrote a small thing instead. Our CMS does posts, guides, and updates, stores them as plain Markdown we own outright, and nothing else. If it ever gets in the way, we can fix it, because it is ours.

## What is coming

Guides are the priority. Minecraft first, then Valheim, Project Zomboid, Rust, and Arma Reforger, each checked against the current version of the game before it goes up. Update posts will land here whenever something ships, changes, or gets fixed.

Tell us what guide your group needs first, in the Discord at discord.gg/xchUdWNbuv.`,
  },
];
