// Vercel serverless entry — wraps the Express app for the
// dobeutech-designsystem-weaver-api-server Vercel project.
//
// The standalone server (src/index.ts -> `pnpm start`) is unchanged and
// remains the path for container/VM hosting. On Vercel, all routes are
// rewritten to this function (see vercel.json); Express receives the
// original request path and routes internally. PORT is not required here.
import app from "../src/app";

export default app;
