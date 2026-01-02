import { App } from "@/app/api/[[...slugs]]/route";
import { treaty } from "@elysiajs/eden";

const app = treaty<App>(process.env.NEXT_PUBLIC_API_URL!);
export default app;
