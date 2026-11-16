/*
 * SPDX-FileCopyrightText: 2026 CERN.
 * SPDX-License-Identifier: MIT
 */

import { act } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import { Image } from "./Image";

jest.mock("axios");

const render = (element) => {
  const div = document.createElement("div");
  const root = createRoot(div);
  act(() => root.render(element));
  return { div, root };
};

afterEach(() => jest.clearAllMocks());

it("renders the src", () => {
  const { div, root } = render(<Image src="/logo.png" fallbackSrc="/fallback.png" />);
  expect(div.querySelector("img").getAttribute("src")).toBe("/logo.png");
  act(() => root.unmount());
});

it("renders the fallback without a request when there is no src", () => {
  const { div, root } = render(<Image fallbackSrc="/fallback.png" loadFallbackFirst />);
  const img = div.querySelector("img");
  expect(img.getAttribute("src")).toBe("/fallback.png");
  expect(img.classList).toContain("fallback_image");
  expect(img.classList).not.toContain("placeholder");
  expect(axios.get).not.toHaveBeenCalled();
  act(() => root.unmount());
});

it("renders the default fallback when there is no src", () => {
  const { div, root } = render(<Image src="" />);
  expect(div.querySelector("img").getAttribute("src")).toBe(
    "/static/images/square-placeholder.png"
  );
  act(() => root.unmount());
});

it("renders nothing when there is no src and no fallback", () => {
  const { div, root } = render(<Image src={undefined} fallbackSrc={null} />);
  expect(div.innerHTML).toBe("");
  act(() => root.unmount());
});
