/* eslint-disable react/no-danger */
import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import Head from 'next/head';
import Link from 'next/link';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import getPrismicClient from '../../../services/prismic';

import styles from '../post.module.scss';

interface SessionProps extends Session {
  activeSubscription: unknown;
}
interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
}

export default function PostPreview({ post }: PostPreviewProps) {
  const [session] = useSession() as [SessionProps | null | undefined, boolean];
  const router = useRouter();

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    }
  }, [post.slug, router, session]);

  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  let post = {};

  try {
    const response = await prismic.getByUID('publication', String(slug), {});

    post = {
      slug,
      title: RichText.asText(response.data.title),
      content: RichText.asHtml(response.data.content.splice(0, 3)),
      updatedAt: new Date(response.last_publication_date).toLocaleDateString(
        'pt-BR',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        },
      ),
    };
  } catch {
    post = {
      slug,
      title: '',
      content: '',
      updatedAt: '',
    };
  }

  return {
    props: {
      post,
    },
    redirect: 60 * 30,
  };
};
