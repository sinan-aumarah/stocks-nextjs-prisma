import { Link } from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title } from "@/config/primitives";
import DefaultLayout from "@/src/layouts/default";
import StocksTable from "@/src/components/stocks/StocksTable";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title({ color: "violet" })}>The revolution&nbsp;</h1>
          <br />
          <h1 className={title({ color: "blue" })}>for long term stock investors</h1>
        </div>

        <div className="flex gap-3">
          <Link
            isExternal
            className={buttonStyles({ color: "success", variant: "shadow", radius: "full" })}
            href={siteConfig.links.swagger}
          >
            Live Swagger
          </Link>
          <Link
            isExternal
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "bordered",
            })}
            href={siteConfig.links.documentation}
          >
            Documentation
          </Link>
          <Link
            isExternal
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href={siteConfig.links.github}
          >
            GitHub
          </Link>
        </div>

        <div className="mt-8">
          <StocksTable />
        </div>
      </section>
    </DefaultLayout>
  );
}
