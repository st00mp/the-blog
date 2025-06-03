### 🛠️ Blog / CMS

This is an ongoing implementation of the multi-authors CMS using **Symfony**, **Next.js** and **ShadCN UI** components.  
The goal is to recreate a clean, elegant blog layout inspired by Vercel’s blog design.

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

<img width="1720" alt="image" src="https://github.com/user-attachments/assets/cbe9067d-0a66-4477-ad82-16b99ff49e97" />

---

#### `/blog/[slug]` – article detail layout  
💡 Metadata + CTA + Vercel-inspired styling

![localhost_3100_blog_comprendre-les-transformateurs-et-les-modeles-de-langage-avances](https://github.com/user-attachments/assets/b4fc2b5b-4c1e-4561-8584-c5103760545e)

---

#### `/admin/article/new` – article creation  
✍️ Structured editor for authors to write high-quality articles

This interface provides a guided, step-by-step layout for writing blog content.  
It's optimized for clarity, SEO-readiness, and a smooth authoring experience.

![localhost_3100_editor_articles_new](https://github.com/user-attachments/assets/4ac3e3c5-ab2e-472b-b19b-3f9f1bdf3ff6)

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

<img width="465" alt="image" src="https://github.com/user-attachments/assets/15d1a2b2-5139-42dc-9249-30744a6baf4c" />

---

#### **Admin Interface** /admin – Admin dashboard

<img width="1723" alt="image" src="https://github.com/user-attachments/assets/e86d05c4-4753-4eb1-b851-204ab7208315" />

---

#### **Author Interface** /editor – Author dashboard

<img width="1719" alt="image" src="https://github.com/user-attachments/assets/a24650e7-70d1-449b-9823-0b47b239ed46" />

---

#### **Author Interface** /editor/articles – Article listing and actions

<img width="1723" alt="image" src="https://github.com/user-attachments/assets/444c561c-3238-4975-93d1-540badb658ae" />

---

#### **User Settings** /account/settings – Personal information and preferences

![localhost_3100_account_settings](https://github.com/user-attachments/assets/dd8b73ca-8a84-4388-9cb7-9f6da6074d4f)



