import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCourseBySlug, getAllCourses } from '@/data/courses';
import CourseView from '@/components/courses/CourseView';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const courses = getAllCourses();
  return courses.map((course) => ({
    slug: course.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) {
    return {
      title: 'Khóa học không tồn tại — Trại Cai Nghiện',
    };
  }

  const title = `${course.title} — Trại Cai Nghiện`;
  const description = course.tagline;
  const url = `https://www.traicainghien.com/khoa-hoc/${course.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Trại Cai Nghiện',
      locale: 'vi_VN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return <CourseView course={course} />;
}
