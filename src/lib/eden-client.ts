import { App } from "@/app/api/[[...slugs]]/route";
import { treaty } from "@elysiajs/eden";

const app = treaty<App>("localhost:3000");
export default app;
