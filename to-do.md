```
/home/jonas/repos/friendshipbubble/discord-bot/src
├── common
│   ├── BuildingBlockType.ts
│   ├── CheckType.ts
│   ├── CommandFlowGroupType.ts
│   ├── config.ts
│   ├── emojis.ts
│   ├── IComponent.ts
│   ├── OnType.ts
│   └── pronounChecker.ts
└── web
    ├── controllers
    │   ├── Health.controller.ts
    │   ├── IRestController.ts
    │   ├── v1
    │   │   ├── Command.controller.ts
    │   │   ├── DiscordBot.controller.ts
    │   │   ├── Discord.controller.ts
    │   │   ├── GuildMember.controller.ts
    │   │   ├── Mira.controller.ts
    │   │   └── Report.controller.ts
    │   └── v2
    │       ├── InternalGuildConfig.controller.ts
    │       ├── InternalGuild.controller.ts
    │       ├── InternalGuildMember.controller.ts
    │       └── InternalWelcomeMessageConfig.controller.ts
    ├── dto
    │   └── APIResponse.dto.ts
    ├── enum
    │   └── StatusCode.ts
    ├── error
    │   ├── GuildChannelNotFoundError.ts
    │   ├── GuildChannelNotTextChannelError.ts
    │   ├── GuildMemberNotFoundError.ts
    │   ├── GuildNotFoundError.ts
    │   ├── MissingParameterError.ts
    │   ├── NotFoundError.test.ts
    │   ├── NotFoundError.ts
    │   ├── NotImplementedError.ts
    │   ├── RouteNotFoundError.ts
    │   └── UnauthorizedError.ts
    ├── index.ts
    ├── middleware
    │   ├── errorHandler.ts
    │   ├── poweredBy.ts
    │   └── routingErrorHandler.ts
    ├── responses
    │   └── APIResponse.ts
    ├── routers
    │   ├── health.router.ts
    │   ├── Router.ts
    │   ├── v1
    │   │   ├── command.router.ts
    │   │   ├── discordBot.router.ts
    │   │   ├── discord.router.ts
    │   │   ├── guildMember.router.ts
    │   │   ├── mira.ts
    │   │   └── report.router.ts
    │   ├── v1.router.ts
    │   ├── v2
    │   │   ├── InternalGuildConfig.router.ts
    │   │   ├── InternalGuildMember.router.ts
    │   │   ├── InternalGuild.router.ts
    │   │   └── InternalWelcomeMessageConfig.router.ts
    │   └── v2.router.ts
    └── services
        ├── v1
        │   ├── commandList.service.ts
        │   ├── commandUsage.service.ts
        │   ├── discordBot.service.ts
        │   ├── discord.service.ts
        │   ├── guildMember.service.ts
        │   └── report.service.ts
        └── v2
            ├── guildConfig.service.ts
            ├── guildMember.service.ts
            ├── guild.server.test.ts
            ├── guild.service.ts
            ├── IGuildConfig.service.ts
            ├── IGuildMember.service.ts
            ├── IGuild.service.ts
            ├── IWelcomeMessageConfig.service.ts
            └── welcomeMessageConfig.service.ts
```