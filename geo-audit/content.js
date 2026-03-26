// content.js — Pure data. Zero logic. All audit content lives here.
// Encoding: UTF-8

window.AUDIT_CONTENT = {

  pageTypes: [
    { id: "onexp-homepage",  label: "OneXP Homepage" },
    { id: "brand-landing",   label: "Brand Landing Page" },
    { id: "plp",             label: "Product Landing Page (PLP)" },
    { id: "pcp",             label: "Product Category Page (PCP)" },
    { id: "campaign",        label: "Campaign Page" },
    { id: "offer-promo",     label: "Offer & Promotional Page" }
  ],

  parts: {

    // ─────────────────────────────────────────────────────────────────────────
    // PART 1 — 8 sections shown to all users
    // ─────────────────────────────────────────────────────────────────────────
    part1: [

      {
        id: "h-tag-hierarchy",
        title: "H-Tag Hierarchy",
        partLabel: "Part 1",
        body: `Search engines and AI crawlers rely on heading tags (H1 through H6) to understand the structure and meaning of a page. A clear, logical heading hierarchy tells crawlers what a page is about, how its content is organized, and which pieces of information are most important. When the hierarchy is messy — skipped levels, duplicate headings, missing H1s — crawlers struggle to make sense of the page, and the content becomes less likely to surface in search results or AI-generated answers.

A critical note about OneXP components: Some OneXP components allow authors to change the semantic h-tag level (H1, H2, H3, etc.) without changing the visual size or style of the headline. This means you cannot rely on visual appearance alone to verify your heading hierarchy. A headline that looks like an H2 on the page may actually be coded as an H4 — or vice versa. Always verify the actual h-tag structure in the live code using a browser tool like the Detailed SEO Extension.`,
        checklist: [
          "The page has exactly one H1 tag that clearly communicates the main topic of the page",
          "Heading tags follow a logical order without skipping levels (e.g., H2 \u2192 H3, not H2 \u2192 H4)",
          "Heading copy is clear and concise \u2014 not so loaded with marketing jargon that the meaning is obscured",
          "The actual h-tag hierarchy has been verified in the live code using a tool like the Detailed SEO Extension, not just eyeballed from the visual design"
        ]
      },

      {
        id: "page-metadata",
        title: "Page Metadata",
        partLabel: "Part 1",
        body: `Every page on OneXP has three metadata fields that should be thoughtfully authored: the Page Title, the Description, and the Navigation Title. These fields directly influence how the page appears in search engine results, how AI models interpret the page's purpose, and how the page is labeled in navigational components like breadcrumbs.

\u2022 Page Title is the meta title that appears in search results and browser tabs. It should be 50\u201360 characters and include the page's primary keywords naturally while remaining readable.
\u2022 Description is the meta description shown beneath the title in search results. While it isn't a direct ranking factor, a well-written description (150\u2013160 characters) improves click-through rates by giving searchers a clear reason to visit the page.
\u2022 Navigation Title controls how the page appears in navigational components on OneXP, such as the Breadcrumb component. It can differ from the Page Title, but should still be clear and descriptive.

The Page Title and Description are easy to check on live pages using the Detailed SEO Extension. The Navigation Title can be validated by asking an author with OneXP access, or seeing how that page appears in the Breadcrumb component.`,
        checklist: [
          "Page Title is authored and is 50\u201360 characters, with primary keywords included naturally",
          "Meta Description is authored and is 150\u2013160 characters, clearly describing what the page contains",
          "Navigation Title is authored and accurately represents the page in breadcrumbs and menus",
          "All three metadata fields have been verified on the live page (not just assumed from the authoring interface)"
        ]
      },

      {
        id: "site-architecture",
        title: "Site Architecture & URL Hierarchy",
        partLabel: "Part 1",
        body: `URLs should follow a clear, logical hierarchy that reflects how the site is organized. This benefits both users — who can glean context about a page from its URL — and search engines, which use URL structure as a signal for understanding content relationships and site hierarchy.

Because the Breadcrumb component on OneXP automatically reflects the actual page hierarchy and URL structure, getting this right is doubly important. Pages must be positioned correctly within the site's content tree for breadcrumbs to display accurate navigation paths. Authors cannot manually override breadcrumb links — they're generated from the page's actual location in the architecture.

When restructuring URLs or moving content, 301 redirects should be implemented for any changed URLs to preserve SEO equity. Old URLs should be mapped to their new equivalents before changes go live, and all redirects should be documented for future reference. Be mindful of redirect chains — avoid redirecting to a page that then redirects again.`,
        checklist: [
          "URLs are descriptive and keyword-rich (e.g., /coca-cola/products/original rather than /p/123)",
          "URLs use hyphens (not underscores) to separate words",
          "URLs are concise and generally stay within 3\u20134 levels of nesting",
          "URL patterns are consistent across similar content types",
          "The page is positioned correctly in the content tree so that breadcrumbs display accurately",
          "If any URLs have been changed or content has been moved, 301 redirects are in place"
        ]
      },

      {
        id: "breadcrumbs",
        title: "Breadcrumbs",
        partLabel: "Part 1",
        body: `The Breadcrumb component on OneXP automatically applies BreadcrumbList schema markup \u2014 one of the few structured data benefits available on the platform today without any additional development work. This schema helps search engines and AI crawlers understand your site's architecture and the relationships between pages, and can result in breadcrumb trails being displayed directly in search results.

Beyond the schema benefit, breadcrumbs are valuable for users. When someone arrives on a page via organic search, a social link, or a shared URL, breadcrumbs immediately orient them within the site and provide easy navigation to parent pages or related content areas.

Since the Navigation Title from the page metadata is what appears as the page's label in the breadcrumb trail, it's important to make sure that field is authored clearly and accurately.`,
        checklist: [
          "The Breadcrumb component is included on the page (recommended for all pages except the OneXP homepage)",
          "The page's Navigation Title is authored clearly, since it will appear as the breadcrumb label",
          "The page is positioned correctly in the site hierarchy so that the breadcrumb path is accurate"
        ]
      },

      {
        id: "images-no-baked-text",
        title: "Images: No Baked-In Text or Buttons",
        partLabel: "Part 1",
        body: `Search engines and AI crawlers cannot read text that is embedded directly inside image files. When headlines, body copy, CTAs, or button labels are baked into an image, that content is completely invisible to crawlers \u2014 meaning it contributes nothing to the page's searchability or AI discoverability. It also creates accessibility problems, since screen readers cannot access text within images.

This applies to all images across OneXP, not just homepage hero banners. Any time an image contains text that communicates important information, that text should be pulled out and rendered as live text using OneXP components, with the image serving as a background or visual complement.

For creative teams designing assets: please design images that function as backgrounds, anticipating that text and buttons will be layered on top using OneXP's native components. Consider composition, color contrast zones, and areas where gradients may be applied to ensure text legibility.`,
        checklist: [
          "No images on the page contain essential text (headlines, CTAs, product names, etc.) baked into the image file",
          "All headlines and copy are rendered as live text via OneXP components, not embedded in images",
          "Button labels and CTAs are live interactive elements, not part of an image",
          "Creative assets are designed to work as backgrounds with overlaid text where needed, not as standalone graphics containing copy"
        ]
      },

      {
        id: "images-alt-text",
        title: "Images: Alt Text",
        partLabel: "Part 1",
        body: `Well-crafted alt text serves two purposes: it makes images accessible to users with visual impairments who rely on screen readers, and it helps search engines and AI crawlers understand what an image depicts. Alt text was originally created for accessibility, and that should remain the primary consideration \u2014 SEO benefits are a secondary advantage.

When writing alt text, describe what's actually in the image in a way that would be useful to someone who can't see it. If branded terms or campaign-specific keywords genuinely describe the image content, they can be included naturally. However, keyword stuffing in alt text is counterproductive \u2014 search engines can detect it and it harms the site's overall quality signals.`,
        checklist: [
          "All meaningful images on the page have alt text authored",
          "Alt text is concise, accurate, and describes what's actually in the image",
          "Alt text is under 125 characters where possible",
          "Alt text does not start with \"Image of...\" or \"Picture of...\"",
          "Keywords are only included in alt text when they naturally describe the image content \u2014 no keyword stuffing"
        ]
      },

      {
        id: "internal-linking",
        title: "Internal Linking",
        partLabel: "Part 1",
        body: `Internal links create pathways between related content on OneXP. For users, they surface relevant content, reduce bounce rates, and create a more connected browsing experience. For search engines and AI crawlers, they distribute page authority, establish topical relationships between pages, and improve crawl efficiency.

Internal links on OneXP can take multiple forms: traditional anchor text links within body copy, or component-based links like teaser cards that point to other pages in the brand area. Both approaches are valuable and work best when used together. A good practice is to include teaser cards or contextual links near the bottom of each page that guide users to related pages.

When writing linked text \u2014 whether it's an in-text link or a teaser card CTA \u2014 use clear, descriptive language. Avoid generic phrasing like "click here" or "learn more" in favor of specific, keyword-aware text like "explore Coca-Cola Zero Sugar products" or "enter the Year of the Cherry sweepstakes."`,
        checklist: [
          "The page includes internal links to related content elsewhere on OneXP (via text links, teaser cards, or other components)",
          "Link text and teaser card CTAs are descriptive and specific \u2014 not generic (\"click here,\" \"learn more\")",
          "The page links to relevant parent, sibling, or child pages where it makes sense contextually",
          "There are no broken internal links on the page"
        ]
      },

      {
        id: "content-guidelines",
        title: "Content Guidelines",
        partLabel: "Part 1",
        body: `Writing content for the modern web is a broad topic, but there are foundational guidelines that apply across the board \u2014 practices that improve clarity for both human readers and AI crawlers, regardless of the brand or page type.

Start with a Clear H1 and Introductory Copy: Every page should open with a clear H1 headline, optionally followed by a brief introductory paragraph that explains what the page is about. Even two or three sentences describing the page's purpose will make a meaningful difference in how it is understood and indexed.

Be Consistent with Product and Brand Names: Use the same name and label consistently across the page and across related pages. Don't call it "Coke Zero" in one section and "Coke ZS" in another. Inconsistent naming dilutes the clarity of the content for crawlers.

Write Descriptive CTA Labels and Link Text: CTAs and link text should clearly communicate what happens when a user clicks. "Enter the Sweepstakes" and "View All Coca-Cola Products" are preferable to "Click Here" or "Learn More."

Use FAQs Intentionally: FAQ sections are valuable for SEO and GEO \u2014 they directly address questions users and AI systems might have. However, FAQs should be tailored to the specific page they appear on. Don't place the same generic brand-level FAQs on every page. Put general brand FAQs on the brand landing page, product-specific FAQs on product pages, and campaign-specific FAQs on campaign pages.

Avoid Placing Key Content in Carousels: On OneXP, when teaser cards are placed inside a carousel component, the title of each card can be duplicated multiple times in the page's h-tag hierarchy. This creates confusing, cluttered signals for AI crawlers. Whenever possible, display teaser cards in a static layout rather than a carousel.`,
        checklist: [
          "The page has a clear H1 that explains the page's purpose",
          "<em>(optional)</em> There is introductory copy following the H1 that further explains the page's purpose",
          "Product and brand names are used consistently throughout the page",
          "Button labels and link text are specific and descriptive, not generic",
          "FAQ content is tailored to the specific page (not copy-pasted across multiple pages)",
          "Key content is not placed inside carousel components (to avoid h-tag duplication issues)",
          "Content is structured with clear sections and headings so that both users and crawlers can easily parse the page"
        ]
      }

    ], // end part1

    // ─────────────────────────────────────────────────────────────────────────
    // PART 2 — 1 section per page type, keyed by page-type ID
    // ─────────────────────────────────────────────────────────────────────────
    part2: {

      "onexp-homepage": {
        id: "pt2-onexp-homepage",
        title: "OneXP Homepage",
        partLabel: "Part 2",
        body: `The OneXP homepage is the single top-level homepage for the entire site \u2014 distinct from individual brand homepages. It's the front door to all of Coca-Cola's brands and content on OneXP.

Currently, this page often functions as a collection of promotional cards from whichever campaigns are running, placed in carousels without a clear content hierarchy. This creates challenges for SEO and GEO: the H1 is typically filled by whichever campaign card appears first in the hero carousel, meaning it changes frequently and tends to be brand- or campaign-specific rather than representative of OneXP as a whole.

Recommendations:

\u2022 Add a clear, stable H1 that speaks to OneXP as a whole rather than to a specific brand or campaign. This H1 should remain consistent and not rotate with promotional content.
\u2022 Include introductory copy below the H1 that briefly explains what OneXP is and what visitors can find here.
\u2022 Consider removing cards from carousels and displaying them in a static layout instead, to clean up the h-tag hierarchy and eliminate duplication issues.`,
        checklist: [
          "The page has a stable H1 that represents OneXP as a whole, not a rotating campaign headline",
          "<em>(optional)</em> There is introductory copy below the H1 explaining what OneXP is",
          "Promotional cards are displayed in static layouts rather than carousels where possible"
        ]
      },

      "brand-landing": {
        id: "pt2-brand-landing",
        title: "Brand Landing Pages",
        partLabel: "Part 2",
        body: `The brand landing page serves as the main entry point into a brand's area on OneXP, introducing visitors to the brand and providing navigation to products, campaigns, and other brand content.

Recommendations:

\u2022 Include an H1 that clearly states the brand name. The headline can include additional marketing copy, but the brand name itself must be prominent and unmistakable. For example, "Coca\u2011Cola\u00ae: Meet the Iconic Coca\u2011Cola Brand & Products" works well because it leads with the brand name and immediately communicates the page's purpose.
\u2022 Organize content into clearly labeled sections. Cards highlighting new products or campaigns should live under a heading like "What's New," while cards linking to product categories could sit under a "Products" heading.
\u2022 Use this page for general brand FAQs. If the brand has frequently asked questions that apply broadly (rather than to a specific product), the brand landing page is the right place for them.`,
        checklist: [
          "The H1 clearly states the brand name and is not obscured by marketing copy",
          "Content sections have descriptive headings (e.g., \"What's New,\" \"Products,\" \"About [Brand]\")",
          "General brand-level FAQs are included here (not duplicated across all brand pages)",
          "Teaser cards or other components link to key sub-pages (product pages, active campaigns, etc.)"
        ]
      },

      "plp": {
        id: "pt2-plp",
        title: "Product Landing Pages (PLPs)",
        partLabel: "Part 2",
        body: `The product landing page is the top-level product overview for a brand. For brands with multiple product categories (e.g., Coca-Cola \u2192 Original, Zero Sugar, Flavors), this page displays cards for each category, linking users deeper into the product hierarchy. For brands without categories, this page lists all individual product SKUs directly.

Recommendations:

\u2022 Include an H1 that states the brand name and the word "Products." For example, "Coca-Cola\u00ae Products." This gives both users and crawlers a clear signal about the page's purpose.
\u2022 All product category cards (or individual product cards, if there are no subcategories) should be H2s. This creates a clean hierarchy: the page headline is the H1, and each product grouping or product beneath it is an H2.`,
        checklist: [
          "The H1 includes the brand name and the word \"Products\" (e.g., \"Coca-Cola\u00ae Products\")",
          "Product category cards (or product cards, if no categories exist) are tagged as H2s",
          "Cards link to the appropriate product category pages or product detail sections"
        ]
      },

      "pcp": {
        id: "pt2-pcp",
        title: "Product Category Pages (PCPs)",
        partLabel: "Part 2",
        body: `Product category pages represent a specific product grouping within a brand \u2014 for example, the "Coca-Cola Flavors" page under Coca-Cola, or the "Zero Sugar" page. These pages list the individual product SKUs within that category along with product descriptions, nutrition facts, and other relevant details.

Recommendations:

\u2022 Include an H1 that clearly identifies the product category. The headline can include marketing-friendly language, but it should contribute to clarity rather than obscure it. For example, "Coca\u2011Cola\u00ae Zero Sugar: Discover Sugar-Free Soda" is a strong H1 because it names the product category and adds descriptive context.
\u2022 Consider including an introductory section with an H2 headline and a brief paragraph explaining more about the product category.
\u2022 Include an H2 that says "Products" to clearly introduce the product listings section of the page.
\u2022 Tag individual product cards as H3s beneath the "Products" H2, creating a clean three-level hierarchy: H1 (category name) \u2192 H2 ("Products") \u2192 H3s (individual SKUs).
\u2022 Include product-specific FAQs that are relevant to this category, not generic brand-level FAQs.`,
        checklist: [
          "The H1 clearly identifies the product category and is not lost in marketing jargon",
          "<em>(optional)</em> There is an introductory section (H2 + brief paragraph) providing context about the product category",
          "An H2 labeled \"Products\" introduces the product listings",
          "Individual product cards are tagged as H3s",
          "FAQs are specific to this product category (not duplicated from the brand landing page)"
        ]
      },

      "campaign": {
        id: "pt2-campaign",
        title: "Campaign Pages",
        partLabel: "Part 2",
        body: `Because campaign page content varies significantly from one campaign to the next, there is no single content template to follow. However, all of the global best practices apply, and it's especially important to pay attention to h-tag hierarchy, clear headings, and avoiding the carousel duplication issue \u2014 since campaign pages often feature a high volume of teaser cards.`,
        checklist: [
          "The page has a clear H1 that identifies the campaign or promotion",
          "Sections of content are organized under descriptive headings",
          "Key content is not buried inside carousels",
          "The page links to related pages (e.g., the product category page for the product being promoted)"
        ]
      },

      "offer-promo": {
        id: "pt2-offer-promo",
        title: "Offer & Promotional Pages",
        partLabel: "Part 2",
        body: `Offer and promotional pages follow a similar pattern to campaign pages \u2014 their content varies widely depending on the specific promotion, so there are no prescriptive content guidelines beyond the global best practices. All of the Part 1 guidance applies in full, with particular attention to maintaining a clean h-tag hierarchy, using descriptive headings, and avoiding carousel-based layouts for important content.`,
        checklist: [
          "The page has a clear H1 that identifies the campaign or promotion",
          "Sections of content are organized under descriptive headings",
          "Key content is not buried inside carousels",
          "The page links to related pages (e.g., the product category page for the product being promoted)"
        ]
      }

    }, // end part2

    // ─────────────────────────────────────────────────────────────────────────
    // PART 3 — Single informational section, no checklist
    // ─────────────────────────────────────────────────────────────────────────
    part3: {
      id: "platform-limitations",
      title: "Platform Limitations & Future Opportunities",
      partLabel: "Part 3",
      body: `The recommendations in this audit cover what can be implemented today using OneXP's existing authoring capabilities and components. The items below are SEO and GEO optimizations that are not currently possible on OneXP due to platform constraints. They would require development work via a Demand Management request to the CEP team.

This section is included so that all teams working on OneXP have a shared understanding of what's in and out of scope when planning page builds and optimizations.

Schema Markup: While OneXP automatically applies some schema markup (ImageObject, VideoObject, BreadcrumbList), authors cannot currently add custom schema to pages or components. High-value schema types not yet available include: Product schema for product pages and tiles; FAQ schema for accordion components containing FAQs; NutritionInformation schema for product nutrition details; Review and AggregateRating schema for customer review content; Organization schema for brand entity information; and Article, Event, and HowTo schema for relevant content types.

Customer Review Integration: OneXP currently lacks the capability to dynamically display authentic customer reviews with proper Review schema markup. A component that pulls in real customer reviews from a trusted platform (such as Bazaarvoice, PowerReviews, or Trustpilot) with proper schema implementation would be a significant enhancement. Review stars in search results improve click-through rates, and user-generated content provides fresh signals for search engines.

Dotter "Shop Now" Integration Improvements: The existing Dotter integration has limitations affecting both user experience and GEO performance, including product association accuracy, modal behavior, schema alignment, and crawlability. Evaluating whether the Dotter integration can be enhanced \u2014 or whether a native OneXP solution would better serve GEO goals \u2014 is worthwhile but outside the scope of what can be actioned today.`,
      checklist: []
    }

  }

};
