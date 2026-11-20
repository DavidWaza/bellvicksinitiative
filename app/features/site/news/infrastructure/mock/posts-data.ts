import { photo } from "~/shared/photos";
import { sample } from "~/shared/sample-content";
import type { Post } from "../../domain/news-types";

/**
 * SAMPLE posts: invented titles, dates and stories (shared/sample-content.ts) so the news pages can
 * be reviewed. Replace with real posts and consented beneficiary stories before launch.
 */
export const POSTS: Post[] = sample([
  {
    id: "news-1",
    kind: "news",
    title: "Book drive puts new books in 300 hands in Keffi",
    excerpt:
      "Volunteers and partners handed out storybooks, exercise books and pencils to out-of-school children across three Keffi communities.",
    category: "Education",
    publishedAt: "2026-10-14",
    image: photo("/images/news/news-1.jpg", "classroomNumbers", "News photo"),
  },
  {
    id: "news-2",
    kind: "news",
    title: "Volunteers pack healthy food for Gwagwalada families",
    excerpt:
      "A weekend of packing turned donated staples into food parcels for vulnerable families, as part of our Zero Hunger work.",
    category: "Health",
    publishedAt: "2026-09-02",
    image: photo("/images/news/news-2.jpg", "teacherAndStudents", "News photo"),
  },
  {
    id: "news-3",
    kind: "news",
    title: "Lokoja community plans its new clean water point",
    excerpt:
      "Residents met with our team to choose the site and agree how the new water point will be looked after.",
    category: "Sustainability",
    publishedAt: "2026-07-21",
    image: photo("/images/news/news-3.jpg", "villageGathering", "News photo"),
  },
  {
    id: "story-1",
    kind: "story",
    title: "Halima's first book",
    excerpt:
      "Halima, 9, had never owned a book before our Keffi book drive. Now she reads to her younger brothers every evening.",
    category: "Story",
    publishedAt: "2026-10-28",
    image: photo("/images/news/story-1.jpg", "childrenWithBooks", "A child from our programmes"),
  },
  {
    id: "story-2",
    kind: "story",
    title: "Back in the classroom",
    excerpt:
      "With new exercise books and a school bag, Daniel, 11, returned to class in Gwagwalada after a year away.",
    category: "Story",
    publishedAt: "2026-08-17",
    image: photo("/images/news/story-2.jpg", "classroomPupils", "A child from our programmes"),
  },
]);
