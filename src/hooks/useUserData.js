import React from "react";

export const useUserData = () => {
  const [user, setData] = React.useState();

  // Fetch data from server and credentials
  React.useEffect(() => {
    setData({
      name: "Adam Livingston",
      role: "NASA Solar Probe Engineer",
      picture: {
        md: "https://s3-alpha-sig.figma.com/img/45b8/e086/eb7883aa2bb588d40d06fc57549e8c66?Expires=1697414400&Signature=dt9Yx4BS5ExBqfvIX0onGOLBUJeQp5~VW14rRC8TiDdSZZoXspyZUUD7iUuQPfaSeeqiLAzmxs7iFEtlwLuqAa7ioDwPLYi83dhMRqHoba37Vc7F9RslF-IH-fIb2Sl1ghX~FeNHVjOH~P6B4htq-w1N3hxtjgLWoCNWVVlD6myomZQBVn4LaOm81EEGrDJ60e3cNYaGjr7W1Mt-7rvsQbAt-8GSN8DodtorPTMPD1VMRyInckXjKLZehXrFdcjgZn1JcKNmEi-H2dNvWop9ddodLAwEvYDTDB8bYCm8IvOjEZ~pH-FXTTl~Sh0ml5U2meXGVPNMppPIGRgisEBb6Q__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4",
      },
    });
  }, []);

  return { user };
};
