### 🛠️ Blog layout – work in progress

This is an ongoing implementation of the `/blog` and `/blog/[slug]` pages using **React** and **ShadCN UI** components.  
The goal is to recreate a clean, elegant blog layout inspired by Vercel’s design system.

---

#### ✅ Current progress

- [x] Set up database structure with users, articles, and categories
- [x] Create static home & article detail pages
- [x] Generate dynamic article detail pages based on slug (`/blog/[slug]`)
- [x] Make homepage dynamic: fetch and display latest articles
- [x] Add search functionality for articles based on keywords
- [x] Add basic authentication (register / login)
- [x] Implement user roles (reader vs author)
- [x] Add comment system (with nesting support)
- [x] Allow authors to create their own articles
- [x] Allow authors to edit their own articles
- [x] Allow authors to delete their own articles
- [x] Allow readers to post and manage their own comments
- [x] Add file upload support (image/video/document per article)
- [x] Add user management from initial .txt file
- [x] Secure form inputs and validate user data
- [x] Ensure full mobile/desktop responsiveness
- [x] Write simplified project documentation
- [x] Add minimal testing coverage

---

### 📸 Screenshots (WIP)

#### `/blog` – static layout  
🧱 Component composition + overall structure

![localhost_3100_blog](https://github.com/user-attachments/assets/9033acdf-79ec-4482-8d60-01a6cfa269a0)

---

#### `/blog/[slug]` – article detail layout  
💡 Metadata + CTA + Vercel-inspired styling

<img width="1720" alt="image" src="https://github.com/user-attachments/assets/03f16f0f-a2bd-4320-9757-61b406f05a74" />

---

#### `/admin/article/new` – article creation  
✍️ Structured editor for authors to write high-quality articles

This interface provides a guided, step-by-step layout for writing blog content.  
It's optimized for clarity, SEO-readiness, and a smooth authoring experience.

![localhost_3100_admin_articles_new (3)](https://github.com/user-attachments/assets/2cf36ab7-778c-4c95-ad28-161aa915462b)

**Key features:**

- 🧱 **Section-based layout**:  
  - Introduction  
  - 3 customizable content steps  
  - Quote or punchline  
  - Conclusion and CTA

- 📝 **Title & metadata fields**:  
  - H1 Title  
  - Meta Title (SEO)  
  - Meta Description (SEO)

- 🧠 **Smart placeholders** to guide the writing process in each section

- 💡 **Rich text editing with Tiptap**:  
  - BubbleMenu with grouped formatting tools (bold, italic, strike, color, highlight)  
  - Alignment, blockquote, link insertion  
  - Lists (bullet, ordered)

- ➕ **Block insertion modal** for:  
  - Images  
  - Tables  
  - Horizontal separators

- ✅ Clean and structured JSON payload ready for export to the backend

---

##### 🎯 Bubble menu with minimal UI  
Floating toolbar with horizontal scroll on overflow — optimized for readability and focus.

![BubbleMenu](https://github.com/user-attachments/assets/aa2741c9-a851-4b82-9eed-3c4246528d17)

---

##### ➕ Block insertion modal  
Quickly insert visuals or layout elements without disrupting the writing flow.

![BlockModal](https://github.com/user-attachments/assets/c5a5fba6-af29-4453-891a-c91798b1b785)





