import { slugify } from "transliteration";
import "../../helpers/firebaseConfig";
import api from "../api";
import env from "../../env";

describe("Firebase test", () => {
  let aticleId, langKey, authorsId, articleAuthors, articleHref;
  random = (min, max) => {
    const rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
  };

  it("Test auth", async () => {
    const lang = await api.signIn(
      env.FIREBASE_AUTH_MAIL,
      env.FIREBASE_AUTH_PASS
    );
    expect(lang).toBeDefined();
  });

  it("GET lang", async () => {
    const lang = await api.fetchAllByEntityName("/lang");
    const randomKey = random(0, lang.length - 1);
    langKey = lang[randomKey].key;
    expect(lang).toBeDefined();
  });

  it("GET catalog + lang", async () => {
    const catalog = await api.fetchAllByEntityName(`/catalog/${langKey}`);
    catalogIds = Object.keys(catalog);
    const randomKey = random(0, catalogIds.length - 1);
    aticleId = catalogIds[randomKey];
    expect(catalog).toBeDefined();
  });

  it("GET article by ID", async () => {
    const article = await api.fetchAllByEntityName(`/articles/${aticleId}`);
    articleAuthors = article.content.find(({ tag }) => tag === "Authors").value;

    expect(article).toBeDefined();
  });

  it("GET role by ID", async () => {
    const key = random(0, articleAuthors.length - 1);
    const { name } = articleAuthors[key];

    authorsId = name.includes(", ")
      ? slugify(name.split(", ")[0])
      : slugify(name);

    const author = await api.fetchAllByEntityName(
      `/role/${langKey}/${authorsId}`
    );

    const randomKey = random(0, author.articles.length - 1);
    articleHref = author.articles[randomKey].href;

    expect(author).toBeDefined();
  });

  it("GET articles from role, search from 'lang' and 'href' by ID", async () => {
    const catalog = await api.fetchAllByEntityName(`/catalog/${langKey}`);
    const article = Object.values(catalog).find(
      ({ href }) => href === articleHref
    );

    expect(article.mainTitle).toBeDefined();
  });
});
