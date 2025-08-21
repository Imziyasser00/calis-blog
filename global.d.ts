import "react";

declare module "react" {
    interface LinkHTMLAttributes<T> extends React.HTMLAttributes<T> {
        fetchpriority?: string;
    }
}
