import type { Metadata } from "next";
import "@roomwalk/roomwalk.css";
import "./roomwalk-demo.css";

export const metadata: Metadata = {
  title: "Walk the hub — ReferralHub",
  description:
    "The ReferralHub offers, laid out as an apartment you walk through: scroll to move from room to room.",
};

export default function RoomWalkLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
