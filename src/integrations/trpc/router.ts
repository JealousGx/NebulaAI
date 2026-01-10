import { createTRPCRouter } from "./init"

import { activityLogRouter } from "./routers/activity-log"
import { endpointsRouter } from "./routers/endpoints"
import { profileRouter } from "./routers/profile"
import { settingsRouter } from "./routers/settings"
import { statsRouter } from "./routers/stats"
import { proxyRouter } from "./routers/proxy"

export const trpcRouter = createTRPCRouter({
	endpoints: endpointsRouter,
	activityLog: activityLogRouter,
	stats: statsRouter,
	profile: profileRouter,
	settings: settingsRouter,
	proxy: proxyRouter,
})

export type TRPCRouter = typeof trpcRouter
