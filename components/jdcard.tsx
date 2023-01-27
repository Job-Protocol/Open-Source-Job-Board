import React from "react";
import bbobHTML from "@bbob/html";
import presetHTML5 from "@bbob/preset-html5";

import { Inter, Titillium_Web } from "@next/font/google";
const inter = Inter({ subsets: ["latin"] });

export interface JdCardProps {
  desc: string;
}

export default function JdCard(data: JdCardProps) {
  if (!data.desc) {
    return <p>NOthing</p>;
  }
  const text: string = bbobHTML(data.desc, presetHTML5());
  return <div dangerouslySetInnerHTML={{ __html: text }} />;
}
