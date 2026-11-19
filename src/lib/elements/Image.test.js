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

describe("load and error handling", () => {
  // load/error don't bubble, so they are dispatched on the <img> itself
  const fire = (el, type) => act(() => el.dispatchEvent(new Event(type)));

  const renderWrapped = (props = {}) =>
    render(
      <Image
        src="/logo.png"
        fallbackSrc="/fallback.png"
        className="avatar"
        wrapped
        {...props}
      />
    );

  it("removes the placeholder class on load", () => {
    const { div, root } = render(<Image src="/logo.png" />);
    const img = div.querySelector("img");
    expect(img.classList).toContain("placeholder");
    fire(img, "load");
    expect(img.classList).not.toContain("placeholder");
    act(() => root.unmount());
  });

  it("removes the placeholder class from the wrapper on load", () => {
    const { div, root } = renderWrapped();
    const wrapper = div.firstChild;
    expect(wrapper.nodeName).toBe("DIV");
    expect(wrapper.classList).toContain("placeholder");
    fire(wrapper.querySelector("img"), "load");
    expect(wrapper.classList).not.toContain("placeholder");
    act(() => root.unmount());
  });

  it("uses the fallback on error when wrapped", () => {
    const { div, root } = renderWrapped();
    const wrapper = div.firstChild;
    const img = wrapper.querySelector("img");
    fire(img, "error");
    expect(img.getAttribute("src")).toBe("/fallback.png");
    expect(wrapper.classList).toContain("fallback_image");
    act(() => root.unmount());
  });

  it("does not loop when the fallback fails too", () => {
    const { div, root } = renderWrapped();
    const img = div.querySelector("img");
    fire(img, "error");
    img.setAttribute("src", "/other.png");
    fire(img, "error");
    expect(img.getAttribute("src")).toBe("/other.png");
    act(() => root.unmount());
  });

  it("allows the fallback again after src changes", () => {
    const div = document.createElement("div");
    const root = createRoot(div);
    const props = { fallbackSrc: "/fallback.png", className: "avatar", wrapped: true };
    act(() => root.render(<Image src="/a.png" {...props} />));
    const img = div.querySelector("img");
    fire(img, "error");
    act(() => root.render(<Image src="/b.png" {...props} />));
    img.setAttribute("src", "/b.png");
    fire(img, "error");
    expect(img.getAttribute("src")).toBe("/fallback.png");
    act(() => root.unmount());
  });

  it("keeps caller-provided children when there is no src", () => {
    const { div, root } = render(
      <Image className="avatar" fallbackSrc="/fallback.png">
        <img src="/avatar.svg" alt="avatar" />
      </Image>
    );
    const wrapper = div.firstChild;
    expect(wrapper.getAttribute("src")).toBeNull();
    expect(wrapper.classList).not.toContain("fallback_image");
    expect(wrapper.querySelector("img").getAttribute("src")).toBe("/avatar.svg");

    fire(wrapper.querySelector("img"), "load");
    expect(wrapper.classList).not.toContain("placeholder");
    act(() => root.unmount());
  });
});
