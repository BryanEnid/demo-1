import React from "react";

export const Typography = ({ variant, children, className, ...rest }) => {
  switch (variant) {
    case "h1": {
      return (
        <h1 {...rest} className={["scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", className].join()}>
          {children}
        </h1>
      );
    }

    case "h2": {
      return (
        <h2 {...rest} className={["mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0", className].join()}>
          {children}
        </h2>
      );
    }

    case "h3": {
      return (
        <h3 {...rest} className={["mt-8 scroll-m-20 text-2xl font-semibold tracking-tight", className].join()}>
          {children}
        </h3>
      );
    }

    // case "h4": {
    //   return (
    //     <h1 {...rest} className={["scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", className].join()}>
    //       {children}
    //     </h1>
    //   );
    // }

    case "large": {
      return (
        <div {...rest} className={["text-lg font-semibold", className].join()}>
          {children}
        </div>
      );
    }

    case "small": {
      return (
        <small {...rest} className={["text-sm font-medium leading-none", className].join()}>
          {children}
        </small>
      );
    }

    case "muted": {
      return (
        <p {...rest} className={["text-sm text-muted-foreground", className].join()}>
          {children}
        </p>
      );
    }

    case "p": {
      return (
        <p {...rest} className={["leading-7 [&:not(:first-child)]:mt-6", className].join()}>
          {children}
        </p>
      );
    }

    case "a": {
      return (
        <a {...rest} className={["font-medium text-primary underline underline-offset-4", className].join()}>
          {children}
        </a>
      );
    }

    case "blockquote": {
      return (
        <blockquote {...rest} className={["mt-6 border-l-2 pl-6 italic", className].join()}>
          {children}
        </blockquote>
      );
    }

    // Default to p
    default:
      return (
        <p {...rest} className={["leading-7 [&:not(:first-child)]:mt-6", className].join()}>
          {children}
        </p>
      );
      break;
  }
};
