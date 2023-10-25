import React from "react";
import { useAuthentication } from "./useAuthentication";

export const useUserData = () => {
  const { user: auth_user } = useAuthentication();

  // const [user, setData] = React.useState();

  // Fetch data from server and credentials

  return {
    user: {
      ...auth_user,
      name: "Adam Livingston",
      role: "NASA Solar Probe Engineer",
      picture: {
        md: "https://s3-alpha-sig.figma.com/img/45b8/e086/eb7883aa2bb588d40d06fc57549e8c66?Expires=1699228800&Signature=A1vaHtMrnoXWmhT9pnBZfCskwT3XiqloOPaUa4G0Xt9plcuGXLzWg6Yiqz5TzF6AYVAKJBSog3LanFuY17RXFuECRQRBEAQOW64KUoci6eKALc8k6F3aGCU4NpiSljfpAJQsw5UVoQPBsgO6reX3jUNNxRgaIUS2uLQqO8XxG~GF1cFWeADlxuXbMIyIhQ6Y8MFE1jDurs51cy0JnPMsULhwvA4Z7myvUPnxv0p-OH76VpomGocpfFvBDCHNnON8SYfTsT-dRp91Npy77duCSbz7JkJXbeyutrrkqDhJMTnlWckEe-Aqe~mX07SBRBznJbVVzSJT4FFX2rf3wtjTpw__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4",
      },
    },
  };
};
