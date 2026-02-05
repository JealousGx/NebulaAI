import { createTRPCRouter } from "./init"

import { activityLogRouter } from "./routers/activity-log"
import { modelsRouter } from "./routers/models"
import { profileRouter } from "./routers/profile"
import { proxyRouter } from "./routers/proxy"
import { settingsRouter } from "./routers/settings"
import { statsRouter } from "./routers/stats"

export const trpcRouter = createTRPCRouter({
	models: modelsRouter,
	activityLog: activityLogRouter,
	stats: statsRouter,
	profile: profileRouter,
	settings: settingsRouter,
	proxy: proxyRouter,
})

export type TRPCRouter = typeof trpcRouter
