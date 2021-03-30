/* eslint-disable react/no-danger */
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { RichText } from 'prismic-dom';
import Head from 'next/head';

import { Session } from 'next-auth';
import getPrismicClient from '../../services/prismic';

import styles from './post.module.scss';

interface SessionProps extends Session {
  activeSubscription: unknown;
}
interface PostProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
}

export default function Post({ post }: PostProps) {
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
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = (await getSession({ req })) as SessionProps;
  const { slug } = params;

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: `/posts/preview/${slug}`,
        permanent: false,
      },
    };
  }

  const prismic = getPrismicClient(req);

  let post = {};

  try {
    const response = await prismic.getByUID('publication', String(slug), {});

    post = {
      slug,
      title: RichText.asText(response.data.title),
      content: RichText.asHtml(response.data.content),
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
  };
};
