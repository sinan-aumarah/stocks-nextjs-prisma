import { GetStaticProps, InferGetStaticPropsType } from "next";
import { createSwaggerSpec } from "next-swagger-doc";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const DynamicSwaggerUI = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
  loading: () => <p>Loading Component...</p>,
});

function ApiDoc({ spec }: InferGetStaticPropsType<typeof getStaticProps>) {
  return <DynamicSwaggerUI spec={spec} />;
}

export const getStaticProps: GetStaticProps = async () => {
  let spec: Record<string, any>;

  spec = createSwaggerSpec({
    apiFolder: "src/pages/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Next Swagger API Example",
        version: "1.0",
      },
    },
  });

  return {
    props: {
      spec,
    },
  };
};

export default ApiDoc;
