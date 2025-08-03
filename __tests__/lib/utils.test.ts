import {
  toCamel,
  toSnake,
  fuzzyMatch,
  isSafeRedirect,
  safeParseDate,
  clearUTCTime,
  formatToUTCDate,
} from "@/lib/utils";

// toCamel / toSnake
describe("toCamel", () => {
  test("snake case becomes camel", () => {
    expect(toCamel({ website_url: "stuff", image_url: "morestuff" })).toEqual({
      websiteUrl: "stuff",
      imageUrl: "morestuff",
    });
  });

  test("camel case doesn't change", () => {
    expect(
      toCamel({ websiteUrl: "stuff", image_url: "morestuff" })
    ).toEqual({
      websiteUrl: "stuff",
      imageUrl: "morestuff",
    });
  });
});

describe("toSnake", () => {
  test("camel case becomes snake", () => {
    expect(toSnake({ websiteUrl: "stuff", imageUrl: "morestuff" })).toEqual({
      website_url: "stuff",
      image_url: "morestuff",
    });
  });

  test("snake case doesn't change", () => {
    expect(toSnake({ websiteUrl: "stuff", image_url: "morestuff" })).toEqual({
      website_url: "stuff",
      image_url: "morestuff",
    });
  });
});

// fuzzyMatch
describe("fuzzyMatch", () => {
  test("'jrdn' fuzzy matches to Jordan Invitational", () => {
    expect(fuzzyMatch("jrdn", "Jordan Invitational")).toBe(true);
  });

  test("'Jrdn' fuzzy matches to Jordan Invitational", () => {
    expect(fuzzyMatch("Jrdn", "Jordan Invitational")).toBe(true);
  });

  test("'aaaa' doesn't fuzzy match to Jordan Invitational", () => {
    expect(fuzzyMatch("aaaa", "Jordan Invitational")).toBe(false);
  });
});

// clearUTCTime
describe("clearUTCTime", () => {
  test("clears time to 00:00... UTC", () => {
    const d = new Date(Date.UTC(2025, 0, 2, 14, 30));
    const result = clearUTCTime(d);
    expect(result.toISOString()).toBe("2025-01-02T00:00:00.000Z");
  });

  test("mutates the original date object", () => {
    const d = new Date(Date.UTC(2025, 0, 2, 14, 30));
    const result = clearUTCTime(d);
    expect(result).toBe(d);
  });
});

// safeParseDate
describe("safeParseDate", () => {
  test("null leads to the fallback being returned", () => {
    const fallback = new Date("2024-01-01");
    expect(safeParseDate(null, fallback)).toEqual(fallback);
  });

  test("null with no fallback is null", () => {
    expect(safeParseDate(null)).toBe(null);
  });

    test("2024-13-06 fails", () => {
        expect(safeParseDate("2024-13-06")).toBe(null);
    })

    test("2024-12-06 is parsed", () => {
        expect(safeParseDate("2024-12-06")).toEqual(new Date(2024, 11,6));
    })

  test("invalid day is rejected", () => {
    const result = safeParseDate("2025-8-32");
    expect(result).toBe(null);
  });
});

// isSafeRedirect
describe("isSafeRedirect", () => {
  test("http://evil.com is not a safe redirect", () => {
    expect(isSafeRedirect("http://evil.com")).toBe(false);
  });

  test("//google.com is not a safe redirect", () => {
    expect(isSafeRedirect("//google.com")).toBe(false);
  });

  test("252f%252fgoogle.com is not a safe redirect", () => {
    expect(isSafeRedirect("252f%252fgoogle.com")).toBe(false);
  });

  test("%2f%2fgoogle.com is not a safe redirect", () => {
    expect(isSafeRedirect("%2f%2fgoogle.com")).toBe(false);
  });

  test("tournaments is a safe redirect", () => {
    expect(isSafeRedirect("tournaments")).toBe(true);
  });
});

// Optional: formatToUTCDate
describe("formatToUTCDate", () => {
  test("formats to MM/DD/YYYY", () => {
    const date = new Date(Date.UTC(2025, 0, 2));
    expect(formatToUTCDate(date)).toBe("01/02/2025");
  });
});
