import { usePost } from '@headstartwp/next';
import { PostParams } from '@headstartwp/core';
import { FC } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import {
    BlogPostAuthor,
    BlogPostBanner,
    BlogPostDate,
    BlogPostImage,
    BlogPostTitle,
  } from '@bigcommerce/components/blog-post-card';
  import { Tag, TagContent } from '@bigcommerce/components/tag';
  import { Link } from '~/components/link';
  import { SharingLinks } from '~/components/sharing-links';

const Blocks = dynamic(() => import('./Blocks').then((mod) => mod.default));

/**
 * This is an example of how an inner component can access the data without explicitly passing the data to it.
 * This reduces prop drilling but creates an implicit dependency with its parent. Use this strategy with caution and on components that are tied to a particular route.
 *
 * @param {*} props Props object
 * @param {PostParams} props.params Params from the homepage.
 *
 * @returns {ReactElement}
 *
 */
export const PageContent: FC<{ params: PostParams }> = ({ params }) => {
	// This won't require a refetch as long as the data has already been fetched at the page level.
	// additionally, if the request has not been SSR'd, it will be fetched on the client only once, regardless of how many call to usePost (with the same params) you make
	const { data } = usePost(params);
    const postDate = new Date(data?.post?.date || new Date());
    const embeddedData = data?.post._embedded as any
    // todo: add wp:featuredmedia to core headstartwp types, so this 'any' solution isn't needed

    return (
        <div className="mx-auto max-w-4xl">
            <h1 className="mb-2 text-3xl font-black lg:text-5xl">{data?.post.title.rendered}</h1>

            <div className="mb-8 flex">
                <BlogPostDate className="mb-0">
                {postDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric'})}
                </BlogPostDate>
                {data?.post?.author?.[0]?.name ? <BlogPostAuthor>, by {data?.post?.author?.[0]?.name}</BlogPostAuthor> : null}
            </div>

            {embeddedData?.['wp:featuredmedia']?.[0] ? (
                <BlogPostImage className="mb-6 h-40 sm:h-80 lg:h-96">
                <Image
                    alt={embeddedData?.['wp:featuredmedia']?.[0]?.alt_text}
                    className="h-full w-full object-cover object-center"
                    height={900}
                    src={embeddedData?.['wp:featuredmedia']?.[0]?.source_url}
                    width={900}
                />
                </BlogPostImage>
            ) : (
                <BlogPostBanner className="mb-6 h-40 sm:h-80 lg:h-96">
                <BlogPostTitle variant="inBanner">
                    <span className="text-blue-primary">{data?.post.title.rendered}</span>
                </BlogPostTitle>
                <BlogPostDate variant="inBanner">
                    <span className="text-blue-primary">
                    {postDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric'})}
                    </span>
                </BlogPostDate>
                </BlogPostBanner>
            )}

            <div className="mb-10 text-base"><Blocks html={data?.post.content.rendered || ""} /></div>
            <div className="mb-10 flex">
                {data?.post?.terms?.category?.map((term, idx) => (
                    <Link className="me-3 block cursor-pointer" href={term.link} key={`term${idx}`}>
                        <Tag>
                        <TagContent>{term.name}</TagContent>
                        </Tag>
                    </Link>
                ))}
            </div>
            <SharingLinks
                blogPostId={data?.post?.slug || ""}
                blogPostImageUrl={embeddedData?.['wp:featuredmedia']?.[0]?.source_url}
                blogPostTitle={data?.post?.title?.rendered || ""}
                vanityUrl={`/wordpress-blog/${data?.post?.slug}`}
            />
        </div>
    )
};