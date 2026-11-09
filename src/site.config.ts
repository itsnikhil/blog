export const siteConfig = {
 url: "https://itsnikhil.github.io/blog/", title: "ItsNikhil",
 author: "Nikhil Taneja", description: "Writing about software, AI, open source, and things I build.",
 lang: "en", ogLocale: "en_US", showLogo: true,
 date: { options: { day: "numeric", month: "short", year: "numeric" } as const },
};
export const menuLinks = [
 { path: "/blog/", title: "Home" }, { path: "/blog/posts/", title: "Writings" },
 { path: "/blog/projects/", title: "Projects" }, { path: "/blog/tags/", title: "Tags" },
];
