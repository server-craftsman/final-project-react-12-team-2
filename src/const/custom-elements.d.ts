declare namespace JSX {
  interface IntrinsicElements {
    "dotlottie-player": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      src?: string;
      background?: string;
      speed?: string;
      style?: React.CSSProperties;
      loop?: boolean;
      autoplay?: boolean;
    };
  }
}
