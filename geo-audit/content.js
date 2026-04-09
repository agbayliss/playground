// content.js — Pure data. Zero logic. All audit content lives here.
// Encoding: UTF-8

window.AUDIT_CONTENT = {

  pageTypes: [
    { id: "onexp-homepage",  label: "OneXP Homepage" },
    { id: "brand-landing",   label: "Brand Landing Page" },
    { id: "plp-categories",  label: "Product Landing Page (PLP) with Categories" },
    { id: "plp-skus",        label: "Product Landing Page (PLP) with Individual SKUs" },
    { id: "pcp",             label: "Product Category Page (PCP)" },
    { id: "other",           label: "Other" }
  ],

  parts: {

    // ─────────────────────────────────────────────────────────────────────────
    // PART 1 — 9 sections shown to all users
    // ─────────────────────────────────────────────────────────────────────────
    part1: [

      {
        id: "h-tag-hierarchy",
        title: "H-Tag Hierarchy",
        partLabel: "Part 1",
        body: `<h3 class="sub-headline">Why It Matters</h3>

<p>Search engines and AI crawlers rely on heading tags (H1 through H6) to understand the structure and meaning of a page. A clear, logical heading hierarchy tells crawlers what a page is about, how its content is organized, and which pieces of information are most important. When the hierarchy is messy — skipped levels, duplicate headings, missing H1s — crawlers struggle to make sense of the page, and the content becomes less likely to surface in search results or AI-generated answers.</p>

<h3 class="sub-headline">OneXP-Specific Notes</h3>

<p>Some OneXP components allow authors to change the semantic h-tag level (H1, H2, H3, etc.) without changing the visual size or style of the headline. This means you cannot rely on visual appearance alone to verify your heading hierarchy. A headline that looks like an H2 on the page may actually be coded as an H4 — or vice versa. Always verify the actual h-tag structure in the live code using a browser tool like the <a href="https://chromewebstore.google.com/detail/detailed-seo-extension/pfjdepjjfjjahkjfpkcgfmfhmnakjfba" target="_blank" rel="noopener" class="ext-link">Detailed SEO Extension</a>.</p>`,
        checklist: [
          { text: "The page has exactly one H1 tag, and the H1 clearly communicates what the page is about", tier: "critical", actionTitle: "Add a clear, singular H1 tag", actionBody: "Every page needs exactly one H1 that tells crawlers and users what the page is about. Use the Detailed SEO Extension to check if the page has zero, one, or multiple H1s, then add or consolidate as needed." },
          { text: "Heading tags follow a logical order without skipping levels (e.g., H2 \u2192 H3, not H2 \u2192 H4)", tier: "critical", actionTitle: "Fix skipped heading levels", actionBody: "Review the page's heading structure using the Detailed SEO Extension and ensure tags descend sequentially (H1 → H2 → H3) with no gaps. For most components on OneXP, authors can use the h-tag dropdown to adjust semantic heading levels without changing the visual style." },
          { text: "Heading copy is clear and concise \u2014 not so loaded with marketing jargon that the meaning is obscured", tier: "important", actionTitle: "Simplify heading copy", actionBody: "Review each heading and ask: would someone unfamiliar with this content understand what this section is about? Rewrite any jargon-heavy headings to clearly describe the content that follows." },
          { text: "The actual h-tag hierarchy has been verified in the live code using a tool like the Detailed SEO Extension, not just eyeballed from the visual design", tier: "important", actionTitle: "Verify h-tags in the live code", actionBody: "Install the Detailed SEO Extension and run it on the live page. Navigate to the "Headings" tab within the extension to view the existing h-tag hierarchy. OneXP components can display one heading size visually while using a different semantic level in the code — the only way to catch this is to inspect the actual HTML." }
        ]
      },

      {
        id: "page-metadata",
        title: "Page Metadata",
        partLabel: "Part 1",
        body: `<h3 class="sub-headline">Why It Matters</h3>

<p>Page metadata controls how a page appears in search engine results and how AI models interpret the page's purpose. Well-authored metadata improves click-through rates from search results, helps crawlers understand what a page is about, and ensures the page is accurately represented in site navigation.</p>

<h3 class="sub-headline">OneXP-Specific Notes</h3>

<p>Every page on OneXP has three metadata fields that should be thoughtfully authored. These fields can be set via the page properties panel in AEM:</p>

<ul class="body-list">
  <li><strong>Page Title</strong> is the meta title that appears in search results and browser tabs. It should be 50–60 characters and include the page's primary keywords naturally while remaining readable.</li>
  <li><strong>Description</strong> is the meta description shown beneath the title in search results. While it isn't a direct ranking factor, a well-written description (150–160 characters) improves click-through rates by giving searchers a clear reason to visit the page.</li>
  <li><strong>Navigation Title</strong> controls how the page appears in navigational components on OneXP, such as the Breadcrumb component. It can differ from the Page Title, but should still be clear and descriptive.</li>
</ul>

<p>The Page Title and Description are easy to check on live pages using the <a href="https://chromewebstore.google.com/detail/detailed-seo-extension/pfjdepjjfjjahkjfpkcgfmfhmnakjfba" target="_blank" rel="noopener" class="ext-link">Detailed SEO Extension</a>. The Navigation Title is verified as part of the Breadcrumbs section of this audit, since the Breadcrumb component is where it surfaces in the UI.</p>`,
        checklist: [
          { text: "Page Title is authored and is 50\u201360 characters, with primary keywords included naturally", tier: "critical", actionTitle: "Author a Page Title (50–60 characters)", actionBody: "Author a meta title in OneXP's page properties that is 50–60 characters long and includes the page's primary keywords naturally. Use the Detailed SEO Extension to verify it on the live page." },
          { text: "Meta Description is authored and is 150\u2013160 characters, clearly describing what the page contains", tier: "important", actionTitle: "Write a Meta Description (150–160 characters)", actionBody: "Author a meta description in OneXP's page properties that is 150–160 characters and clearly tells searchers what the page contains while using keywords naturally." }
        ]
      },

      {
        id: "site-architecture",
        title: "Site Architecture & URL Hierarchy",
        partLabel: "Part 1",
        body: `<h3 class="sub-headline">Why It Matters</h3>

<p>URLs should follow a clear, logical hierarchy that reflects how the site is organized. This benefits both users — who can glean context about a page from its URL — and search engines, which use URL structure as a signal for understanding content relationships and site hierarchy.</p>

<h3 class="sub-headline">OneXP-Specific Notes</h3>

<p>The Breadcrumb component on OneXP automatically reflects the actual page hierarchy and URL structure, which makes getting this right doubly important. Pages must be positioned correctly within the site's content tree for breadcrumbs to display accurate navigation paths. Authors cannot manually override breadcrumb links — they're generated from the page's actual location in the architecture.</p>`,
        checklist: [
          { text: "URL is descriptive and keyword-rich (e.g. /coca-cola/products/original rather than /p/123)", tier: "important", actionTitle: "Make the URL descriptive and keyword-rich", actionBody: "Update the URL with natural language and coordinate with the team to implement a 301 redirect from the old URL." },
          { text: "URL uses hyphens (not underscores) to separate words", tier: "nice-to-have", actionTitle: "Replace underscores with hyphens in the URL", actionBody: "Update the URL to use hyphens, and coordinate with the team to implement a 301 redirect from the old URL." },
          { text: "URL is concise and generally stays within 3-4 levels of nesting", tier: "nice-to-have", actionTitle: "Shorten deeply nested URLs", actionBody: "Consider whether the page can be repositioned higher in the site's content tree, and coordinate with the team to adjust." }
        ]
      },

      {
        id: "breadcrumbs",
        title: "Breadcrumbs",
        partLabel: "Part 1",
        body: `<h3 class="sub-headline">Why It Matters</h3>

<p>Breadcrumbs are valuable for both users and crawlers. When someone arrives on a page via organic search, a social link, or a shared URL, breadcrumbs immediately orient them within the site and provide easy navigation to parent pages or related content areas. For search engines and AI crawlers, breadcrumbs help communicate site architecture and the relationships between pages, and can result in breadcrumb trails being displayed directly in search results.</p>

<h3 class="sub-headline">OneXP-Specific Notes</h3>

<p>The Breadcrumb component on OneXP automatically applies <strong>BreadcrumbList</strong> schema markup — one of the few structured data benefits available on the platform today without any additional development work. Since the Navigation Title from the page metadata is what appears as the page's label in the breadcrumb trail, it's important to make sure that field is authored clearly and accurately.</p>`,
        checklist: [
          { text: "The Breadcrumb component is included on the page (recommended for all pages except the OneXP homepage)", tier: "critical", actionTitle: "Add the Breadcrumb component to the page", actionBody: "This is one of the few components that automatically generates BreadcrumbList schema markup, which helps crawlers understand your site's hierarchy and can display breadcrumb trails in search results." },
          { text: "The page's Navigation Title is authored clearly and appears as the breadcrumb label for this page", tier: "important", actionTitle: "Author a clear Navigation Title", actionBody: "Author the Navigation Title in OneXP's page properties. This field controls how the page is labeled in the Breadcrumb component, so it should be concise and clearly describe the page's content." },
          { text: "The page is positioned correctly in the site hierarchy so that the breadcrumb path is accurate", tier: "important", actionTitle: "Verify the page's position in the content tree", actionBody: "Breadcrumb paths are generated automatically from the page's position — they can't be manually overridden — so an incorrect placement produces misleading breadcrumbs." }
        ]
      },

      {
        id: "images-no-baked-text",
        title: "Images: No Baked-In Text or Buttons",
        partLabel: "Part 1",
        body: `<h3 class="sub-headline">Why It Matters</h3>

<p>Search engines and AI crawlers cannot read text that is embedded directly inside image files. When headlines, body copy, CTAs, or button labels are baked into an image, that content is completely invisible to crawlers — meaning it contributes nothing to the page's searchability or AI discoverability. It also creates accessibility problems, since screen readers cannot access text within images.</p>

<h3 class="sub-headline">OneXP-Specific Notes</h3>

<p>An authoring pattern that's unfortunately become common on OneXP is baking text and buttons into images, especially in hero positions on pages. While this achieves the intended visual effect, it makes that content invisible to crawlers and screen readers.</p>

<p>The recommended approach is to use OneXP's <strong>Hero Teaser</strong> component with live text and buttons overlaid on the background image. For creative teams designing assets: please design images that function as backgrounds, anticipating that text and buttons will be layered on top of them.</p>

<p>An alternative solution, if the gradient is a concern, is to author the headline and CTA as a separate rich text component positioned above or below the hero image on the page. This allows the image to be displayed without a gradient, while keeping the important text live and crawlable.</p>`,
        checklist: [
          { text: "All essential headlines and copy are rendered as live text via OneXP components, not embedded in images", tier: "critical", actionTitle: "Pull baked-in text out of images", actionBody: "Identify any images on the page that contain essential text content (headlines, body copy, etc). Replace them with live text rendered through OneXP components (such as the Hero Teaser), using the image as a visual background only. Crawlers and screen readers cannot read text inside images." },
          { text: "All buttons/CTAs are live interactive elements, not embedded in images", tier: "critical", actionTitle: "Replace image-embedded CTAs with live buttons", actionBody: "Check for any CTA buttons that are part of an image file rather than live interactive elements. Replace them with OneXP button components so they are clickable, accessible, and visible to crawlers." }
        ]
      },

      {
        id: "images-alt-text",
        title: "Images: Alt Text",
        partLabel: "Part 1",
        body: `<h3 class="sub-headline">Why It Matters</h3>

<p>Well-crafted alt text serves two purposes: it makes images accessible to users with visual impairments who rely on screen readers, and it helps search engines and AI crawlers understand what an image depicts. Alt text was originally created for accessibility, and that should remain the primary consideration — SEO benefits are a secondary advantage.</p>

<p>When writing alt text, describe what's actually in the image in a way that would be useful to someone who can't see it. If branded terms or campaign-specific keywords genuinely describe the image content, they can be included naturally. However, keyword stuffing in alt text is counterproductive — search engines can detect it and it harms the site's overall quality signals.</p>

<h3 class="sub-headline">OneXP-Specific Notes</h3>

<p>In OneXP's AEM environment, alt text should be authored on the asset itself where it lives in the <strong>DAM</strong> (Digital Asset Manager). When alt text is written at the asset level, it will automatically populate wherever that asset is used across the site — ensuring consistency and reducing the risk of images being published without alt text.</p>

<p>To verify alt text on a live page, the <a href="https://chromewebstore.google.com/detail/image-alt-text-viewer/nhmihbneenlkbjjpbimhegikadfleccd" target="_blank" rel="noopener" class="ext-link">Image Alt Text Viewer</a> Chrome extension is an easy way to view the alt text on all images on a single web page at a glance.</p>`,
        checklist: [
          { text: "All meaningful images on the page have alt text authored", tier: "critical", actionTitle: "Add alt text to all meaningful images", actionBody: "In the DAM in AEM, author alt text in the description field of all meaningful images on the page. This alt text will populate everywhere the image is used. Once published, use the Image Alt Text Viewer extension on the live page to verify." },
          { text: "Alt text is concise, accurate, and describes what's actually in the image", tier: "important", actionTitle: "Improve alt text accuracy and conciseness", actionBody: "Review each image's alt text and ensure it accurately describes what's depicted — not what you wish the image communicated for SEO purposes. Keep descriptions under 125 characters and focus on what would be useful to someone who can't see the image." },
          { text: "Alt text does not start with \"Image of...\" or \"Picture of...\"", tier: "nice-to-have", actionTitle: "Remove \"Image of...\" prefixes from alt text", actionBody: "Screen readers already announce that an element is an image, so starting alt text with \"Image of...\" or \"Picture of...\" is redundant. Remove these prefixes from any alt text that has them." },
          { text: "Keywords are only included in alt text when they naturally describe the image content \u2014 no keyword stuffing", tier: "nice-to-have", actionTitle: "Remove keyword stuffing from alt text", actionBody: "Review alt text for any instances where keywords have been added for SEO purposes rather than to describe the actual image content. Search engines can detect keyword stuffing in alt text and it harms the page's overall quality signals." }
        ]
      },

      {
        id: "internal-linking",
        title: "Internal Linking",
        partLabel: "Part 1",
        body: `<h3 class="sub-headline">Why It Matters</h3>

<p>Internal links create pathways between related content on a site. For users, they surface relevant content, reduce bounce rates, and create a more connected browsing experience. For search engines and AI crawlers, they distribute page authority, establish topical relationships between pages, and improve crawl efficiency.</p>

<p>When writing linked text — whether it's an in-text link or a CTA — use clear, descriptive language. Avoid generic phrasing like "click here" or "learn more" in favor of specific, keyword-aware text like "explore Coca-Cola Zero Sugar products" or "enter the Year of the Cherry sweepstakes."</p>

<h3 class="sub-headline">OneXP-Specific Notes</h3>

<p>Internal links on OneXP can take multiple forms: traditional anchor text links within body copy, or component-based links like teaser cards that point to other pages in the brand area. Both approaches are valuable and work best when used together. A good practice is to include teaser cards or contextual links near the bottom of each page that guide users to related pages.</p>`,
        checklist: [
          { text: "Beyond its main navigation cards, the page includes supplementary internal links to related content on OneXP", tier: "important", actionTitle: "Add internal links to related content", actionBody: "Look for natural opportunities to link this page to related content elsewhere on OneXP — parent pages, sibling pages, or related campaigns. Use teaser cards near the bottom of the page, or contextual text links within body copy, to create pathways for both users and crawlers." },
          { text: "Link text and teaser card CTAs are descriptive and specific \u2014 not generic (\"click here,\" \"learn more\")", tier: "important", actionTitle: "Make link text and CTAs more descriptive", actionBody: "Replace any generic CTA labels like \"Click Here,\" \"Learn More,\" or \"Explore\" with specific, descriptive text that communicates what the user will find (e.g., \"Explore Coca-Cola Zero Sugar Products\" or \"Enter the Sweepstakes\")." }
        ]
      },

      {
        id: "faqs",
        title: "FAQs",
        partLabel: "Part 1",
        body: `<h3 class="sub-headline">Why It Matters</h3>

<p>FAQ sections are one of the most valuable content types for SEO and GEO. They directly mirror how people search — and how AI systems process information — by pairing specific questions with clear, concise answers. When a user asks an AI assistant a question about a product or brand, FAQ content structured as explicit question-and-answer pairs is among the most likely content to be surfaced in the response. FAQs also create opportunities for pages to appear in featured snippets and "People Also Ask" results in traditional search.</p>

<h3 class="sub-headline">OneXP-Specific Notes</h3>

<p>On OneXP, each FAQ question and answer should be placed in its own accordion component. All accordions should be grouped under a single heading that reads "Frequently Asked Questions." Pay attention to the h-tag hierarchy of this section: the "Frequently Asked Questions" headline should sit at the appropriate level in the page's overall hierarchy (typically an H2), and each individual question headline within the accordions should be one level below it (typically H3s).</p>`,
        checklist: [
          { text: "The page includes an FAQ section", tier: "important", actionTitle: "Add an FAQ section to the page", actionBody: "Create an FAQ section with questions and answers relevant to this specific page's content. FAQ content is highly valuable for GEO — it mirrors how users ask questions and how AI systems process information, making it one of the most likely content types to surface in AI-generated answers." },
          { text: "The section includes a headline that reads \"Frequently Asked Questions\"", tier: "important", actionTitle: "Add a \"Frequently Asked Questions\" headline", actionBody: "Add a heading that reads \"Frequently Asked Questions\" above the group of FAQs. This explicit label helps crawlers identify the section as FAQ content." },
          { text: "Each question is authored in an accordion underneath the \"Frequently Asked Questions\" headline", tier: "important", actionTitle: "Place each FAQ in its own accordion", actionBody: "Author each question-and-answer pair in its own accordion component, and group all accordions under the \"Frequently Asked Questions\" heading. This is the standard OneXP pattern for FAQ content." },
          { text: "Both the headline and accordions are appropriately nested within the page's h-tag hierarchy (e.g., each question's headline is one level below the section headline)", tier: "important", actionTitle: "Fix the FAQ section's h-tag nesting", actionBody: "Check that the \"Frequently Asked Questions\" heading sits at the right level in the page's overall heading hierarchy (typically H2), and that each individual question heading within the accordions is one level below it (typically H3). Use the Detailed SEO Extension to verify." }
        ]
      },

      {
        id: "carousels",
        title: "Carousels",
        partLabel: "Part 1",
        body: `<h3 class="sub-headline">Why It Matters</h3>

<p>Carousels present challenges for both SEO and GEO. Multiple studies on carousel engagement — including research by <a href="https://erikrunyon.com/2013/01/carousel-interaction-stats/" target="_blank" rel="noopener" class="ext-link">Erik Runyon at the University of Notre Dame</a> and <a href="https://smileycat.com/image-carousel-click-through-rate-analysis/" target="_blank" rel="noopener" class="ext-link">analyses of e-commerce sites</a> — have shown that the vast majority of user interaction goes to the first slide, with engagement dropping off steeply after that. Content placed in later slides is rarely seen or clicked. This means that any important content buried beyond the first slide of a carousel is likely invisible to most visitors.</p>

<h3 class="sub-headline">OneXP-Specific Notes</h3>

<p>On OneXP specifically, there is an additional technical issue with carousels. When teaser cards are placed inside a carousel component, the way the carousel is built in the code causes the title of each card to be duplicated multiple times in the page's h-tag hierarchy. For example, if three teaser cards are placed in a carousel, the headline of each card may appear up to five times in the underlying code. This creates a cluttered, confusing signal for AI crawlers — they encounter the same headline repeated over and over, which muddies the structure of the page and makes it harder to determine what's actually important.</p>

<p>Whenever possible, display teaser cards and other content in a static layout (such as a grid or vertical stack) rather than placing them in a carousel.</p>`,
        checklist: [
          { text: "Essential content (that plays a key role in a crawler\u2019s understanding of the overall page content) is not placed inside a carousel", tier: "critical", actionTitle: "Move essential content out of carousels", actionBody: "Identify any content inside carousel components that is important for crawlers to understand the page. Move it into a static layout like a grid or vertical stack. OneXP carousels duplicate each card's headline up to 5× in the underlying code, creating a cluttered signal for AI crawlers, so it's best for essential content to live outside carousels to avoid this problem." }
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
        body: `<p>The OneXP homepage is the single top-level homepage for the entire site, distinct from individual brand homepages. It's the front door to all of Coca-Cola's brands and content on OneXP.</p>

<p>Currently, this page functions as a collection of promotional cards from whichever campaigns are running, placed in carousels without a clear content hierarchy. This creates challenges for SEO and GEO: the H1 is typically filled by whichever campaign card appears first in the hero carousel, meaning it changes frequently and tends to be brand- or campaign-specific rather than representative of OneXP as a whole.</p>

<h3 class="sub-headline">Recommendations</h3>

<ul class="body-list">
  <li>Add a clear, stable H1 that speaks to OneXP as a whole rather than to a specific brand or campaign. This H1 should remain consistent and not rotate with promotional content.</li>
  <li>Include introductory copy below the H1 that briefly explains what OneXP is and what visitors can find here.</li>
  <li>Consider removing cards from carousels and displaying them in a static layout instead, to clean up the h-tag hierarchy and eliminate duplication issues.</li>
</ul>`,
        checklist: [
          { text: "The H1 is evergreen and represents OneXP as a whole \u2014 it is not a rotating campaign or brand-specific headline", tier: "critical", actionTitle: "Set a stable, evergreen H1 for the OneXP homepage", actionBody: "This H1 doesn't need to replace the existing hero carousel, but it should go above that content to introduce the page and OneXP as a whole. This H1 should remain consistent regardless of which promotional content is currently featured on the page." },
          { text: "There is introductory copy below the H1 explaining what OneXP is", tier: "nice-to-have", actionTitle: "Add introductory copy explaining what OneXP is", actionBody: "Add a brief paragraph below the H1 that explains what OneXP is and what visitors can find on the site. This orients users arriving from search or shared links and gives crawlers additional context about the page's purpose." }
        ]
      },

      "brand-landing": {
        id: "pt2-brand-landing",
        title: "Brand Landing Pages",
        partLabel: "Part 2",
        body: `<p>The brand landing page serves as the main entry point into a brand's area on OneXP, introducing visitors to the brand and providing navigation to products, campaigns, and other brand content.</p>

<h3 class="sub-headline">Recommendations</h3>

<ul class="body-list">
  <li>Include an H1 that clearly states the brand name. The headline can include additional marketing copy, but the brand name itself must be prominent and unmistakable. For example, "Coca\u2011Cola\u00ae: Meet the Iconic Coca\u2011Cola Brand &amp; Products" works well because it leads with the brand name and immediately communicates the page's purpose.</li>
  <li>Organize content into clearly labeled sections. Cards highlighting new products or campaigns should live under a heading like "What's New," while cards linking to product categories could sit under a "Products" heading.</li>
  <li>Use this page for general brand FAQs. If the brand has frequently asked questions that apply broadly (rather than to a specific product), the brand landing page is the right place for them.</li>
</ul>`,
        checklist: [
          { text: "The H1 includes the actual brand name (e.g., 'Fanta'), not just marketing copy that omits it", tier: "critical", actionTitle: "Include the brand name in the H1", actionBody: "Make sure the H1 prominently features the actual brand name — not just marketing copy or a tagline that omits it. The H1 can include additional creative language, but the brand name must be unmistakable (e.g., \"Coca\u2011Cola\u00ae: Meet the Iconic Coca\u2011Cola Brand & Products\")." },
          { text: "Content sections have descriptive headings (e.g., \"What's New,\" \"Products,\" \"About [Brand]\")", tier: "important", actionTitle: "Add descriptive headings to content sections", actionBody: "Organize the page's content under clearly labeled section headings like \"What's New,\" \"Products,\" or \"About [Brand].\" Descriptive headings help both users and crawlers understand the page's structure and find relevant content." },
          { text: "The FAQs cover topics relevant to the brand as a whole, not specific to a single product or campaign", tier: "important", actionTitle: "Ensure FAQs are brand-level (not product-specific)", actionBody: "Review the FAQ content on this page and confirm the questions apply broadly to the brand. Product-specific FAQs should live on the relevant product page, and campaign-specific FAQs on the campaign page. This avoids duplicate content and keeps each page focused." },
          { text: "Teaser cards or other components link to key sub-pages (product pages, active campaigns, etc.)", tier: "important", actionTitle: "Link to key sub-pages via teaser cards", actionBody: "Add teaser cards or other navigational components that link to the brand's most important sub-pages — product landing pages, active campaigns, and other key content areas. These links create pathways for both users and crawlers to discover more content." }
        ]
      },

      "plp-categories": {
        id: "pt2-plp-categories",
        title: "Product Landing Pages (PLPs) with Categories",
        partLabel: "Part 2",
        body: `<p>This type of PLP is the top-level product overview that highlights all of the product categories available within a brand.</p>

<h3 class="sub-headline">Recommendations</h3>

<ul class="body-list">
  <li>Include an H1 that states the brand name and the word "Products." For example, "Coca-Cola\u00ae Products." This gives both users and crawlers a clear signal about the page's purpose. The headline can include marketing-friendly language, but it should contribute to clarity rather than obscure it.</li>
  <li>Each product category should be displayed in a teaser card that, when clicked, takes the user deeper into the hierarchy to a Product Category Page (PCP).</li>
</ul>`,
        checklist: [
          { text: "The H1 includes both the brand name and the word \"Products\" (e.g., \"Coca-Cola\u00ae Products\")", tier: "critical", actionTitle: "Include brand name + \"Products\" in the H1", actionBody: "Update the H1 to include both the brand name and the word \"Products\" (e.g., \"Coca-Cola\u00ae Products\"). This gives crawlers and users a clear signal about the page's purpose. Marketing-friendly language is fine as long as the brand name and \"Products\" are both present." },
          { text: "Product categories are displayed in teaser cards and each link to the appropriate PCP", tier: "important", actionTitle: "Link each category card to its PCP", actionBody: "Verify that every product category teaser card on the page links to the correct Product Category Page (PCP). Broken or missing links prevent crawlers from discovering deeper product content and block users from navigating the product hierarchy." }
        ]
      },

      "plp-skus": {
        id: "pt2-plp-skus",
        title: "Product Landing Pages (PLPs) with Individual SKUs",
        partLabel: "Part 2",
        body: `<p>This type of PLP is the top-level product overview that highlights all of the individual product SKUs available within a brand.</p>

<h3 class="sub-headline">Recommendations</h3>

<ul class="body-list">
  <li>Include an H1 that states the brand name and the word "Products." For example, "Fanta\u00ae Products." This gives both users and crawlers a clear signal about the page's purpose. The headline can include marketing-friendly language, but it should contribute to clarity rather than obscure it.</li>
  <li>Each product SKU should be displayed in a product card that includes the nutrition facts and available sizes of the SKU.</li>
  <li>Include FAQs that are specific to the products listed on the page. Each FAQ should be placed in an accordion, and all of the accordions should be under a headline that reads "Frequently Asked Questions".</li>
</ul>

<h3 class="sub-headline">For Individual Product SKUs</h3>

<p>Each product SKU should be displayed in a product card that includes the nutrition facts and available sizes of the SKU. Pay attention to the h-tag hierarchy for "View Nutrition Facts" and "Ingredients." These headings are typically authored as H3s by default, but they should be nested underneath the product title in the hierarchy — not at the same level.</p>

<div class="code-block">
  <div class="code-block-label">Example — default h-tag hierarchy (incorrect):</div>
  <pre>H3: Coca-Cola Cherry Float
H3: View Nutrition Facts
H3: Ingredients</pre>
</div>

<div class="code-block">
  <div class="code-block-label">Example — corrected h-tag hierarchy:</div>
  <pre>H3: Coca-Cola Cherry Float
  H4: View Nutrition Facts
    H5: Ingredients</pre>
</div>`,
        checklist: [
          { text: "The H1 includes both the brand name and the word \"Products\" (e.g., \"Fanta\u00ae Products\")", tier: "critical", actionTitle: "Include brand name + \"Products\" in the H1", actionBody: "Update the H1 to include both the brand name and the word \"Products\" (e.g., \"Fanta\u00ae Products\"). This gives crawlers and users a clear signal about the page's purpose. Marketing-friendly language is fine as long as the brand name and \"Products\" are both present." },
          { text: "The FAQs are topically relevant to the products featured on the page (not generic brand-wide FAQs)", tier: "important", actionTitle: "Make FAQs specific to these products", actionBody: "Review the FAQ content and confirm the questions are relevant to the specific products listed on this page — not generic brand-level FAQs that have been copied from the brand landing page." },
          { text: "Each product SKU is displayed in a product card that includes the nutrition facts and available sizes of the SKU", tier: "important", actionTitle: "Display each SKU in a product card", actionBody: "Ensure each product SKU on the page is displayed using a product card component that includes nutrition facts and available sizes. This structured product detail content is valuable for crawlers and helps users compare products." },
          { text: "The \"View Nutrition Facts\" and \"Ingredients\" headlines are appropriately nested underneath the product title in the page's h-tag hierarchy", tier: "important", actionTitle: "Fix nutrition/ingredients heading nesting", actionBody: "Check that \"View Nutrition Facts\" and \"Ingredients\" are nested underneath the product name in the heading hierarchy — not at the same level. The default OneXP behavior usually puts these at H3, but they should be H4/H5 under the product name's H3. Use the Detailed SEO Extension to verify." }
        ]
      },

      "pcp": {
        id: "pt2-pcp",
        title: "Product Category Pages (PCPs)",
        partLabel: "Part 2",
        body: `<p>Product category pages highlight all of the individual product SKUs available within a specific grouping of a brand.</p>

<h3 class="sub-headline">Recommendations</h3>

<ul class="body-list">
  <li>Include an H1 that states the brand name and the word "Products." For example, "Coca\u2011Cola\u00ae Zero Sugar Products." This gives both users and crawlers a clear signal about the page's purpose. The headline can include marketing-friendly language, but it should contribute to clarity rather than obscure it.</li>
  <li>Each product SKU should be displayed in a product card that includes the nutrition facts and available sizes of the SKU.</li>
  <li>Include FAQs that are specific to the products listed on the page. Each FAQ should be placed in an accordion, and all of the accordions should be under a headline that reads "Frequently Asked Questions".</li>
</ul>

<h3 class="sub-headline">For Individual Product SKUs</h3>

<p>Each product SKU should be displayed in a product card that includes the nutrition facts and available sizes of the SKU. Pay attention to the h-tag hierarchy for "View Nutrition Facts" and "Ingredients." These headings are typically authored as H3s by default, but they should be nested underneath the product title in the hierarchy — not at the same level.</p>

<div class="code-block">
  <div class="code-block-label">Example — default h-tag hierarchy (incorrect):</div>
  <pre>H3: Coca-Cola Cherry Float
H3: View Nutrition Facts
H3: Ingredients</pre>
</div>

<div class="code-block">
  <div class="code-block-label">Example — corrected h-tag hierarchy:</div>
  <pre>H3: Coca-Cola Cherry Float
  H4: View Nutrition Facts
    H5: Ingredients</pre>
</div>`,
        checklist: [
          { text: "The H1 includes both the brand name and the word \"Products\" (e.g., \"Fanta\u00ae Products\")", tier: "critical", actionTitle: "Include brand name + \"Products\" in the H1", actionBody: "Update the H1 to include both the brand name and the word \"Products\" (e.g., \"Coca-Cola\u00ae Zero Sugar Products\"). This gives crawlers and users a clear signal about the page's purpose. Marketing-friendly language is fine as long as the brand name and \"Products\" are both present." },
          { text: "The FAQs are topically relevant to the products featured on the page (not generic brand-wide FAQs)", tier: "important", actionTitle: "Make FAQs specific to this product category", actionBody: "Review the FAQ content and confirm the questions are relevant to the specific products listed on this page — not generic brand-level FAQs that have been copied from the brand landing page." },
          { text: "Each product SKU is displayed in a product card that includes the nutrition facts and available sizes of the SKU", tier: "important", actionTitle: "Display each SKU in a product card", actionBody: "Ensure each product SKU on the page is displayed using a product card component that includes nutrition facts and available sizes. This structured product detail content is valuable for crawlers and helps users compare products." },
          { text: "The \"View Nutrition Facts\" and \"Ingredients\" headlines are appropriately nested underneath the product title in the page's h-tag hierarchy", tier: "important", actionTitle: "Fix nutrition/ingredients heading nesting", actionBody: "Check that \"View Nutrition Facts\" and \"Ingredients\" are nested underneath the product name in the heading hierarchy — not at the same level. The default OneXP behavior usually puts these at H3, but they should be H4/H5 under the product name's H3. Use the Detailed SEO Extension to verify." }
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
      body: `<p>The recommendations in this audit cover what can be implemented today using OneXP's existing authoring capabilities and components. The items below are SEO and GEO optimizations that are not currently possible on OneXP due to platform constraints. They would require development work via a Demand Management request to the CEP team.</p>

<p>This section is included so that all teams working on OneXP have a shared understanding of what's in and out of scope when planning page builds and optimizations.</p>

<h3 class="sub-headline">Schema Markup</h3>

<p>While OneXP automatically applies some schema markup (ImageObject, VideoObject, BreadcrumbList), authors cannot currently add custom schema to pages or components. High-value schema types not yet available include: Product schema for product pages and tiles; FAQ schema for accordion components containing FAQs; NutritionInformation schema for product nutrition details; Review and AggregateRating schema for customer review content; Organization schema for brand entity information; and Article, Event, and HowTo schema for relevant content types.</p>

<h3 class="sub-headline">Customer Review Integration</h3>

<p>OneXP currently lacks the capability to dynamically display authentic customer reviews with proper Review schema markup. A component that pulls in real customer reviews from a trusted platform (such as Bazaarvoice, PowerReviews, or Trustpilot) with proper schema implementation would be a significant enhancement. Review stars in search results improve click-through rates, and user-generated content provides fresh signals for search engines.</p>

<h3 class="sub-headline">Dotter "Shop Now" Integration Improvements</h3>

<p>The existing Dotter integration has limitations affecting both user experience and GEO performance, including product association accuracy, modal behavior, schema alignment, and crawlability. Evaluating whether the Dotter integration can be enhanced — or whether a native OneXP solution would better serve GEO goals — is worthwhile but outside the scope of what can be actioned today.</p>`,
      checklist: []
    }

  }

};
