import {
	usePosts,
	fetchHookData,
	addHookData,
	handleError,
	useAppSettings,
    HeadlessGetStaticProps,
    HeadlessGetServerSideProps,
} from '@headstartwp/next';
import { FC } from 'react'; 
import { resolveBatch } from '../../lib/promises';
import { BlogPostCard } from '~/components/blog-post-card';
import { Footer } from '~/components/footer/client';
import { PagesHeader } from '~/components/header/client';

const ArchivePage: FC = () => {

    const { loading, error, data } = usePosts({ per_page: 10 }, { swr: { revalidateOnMount: true } });

    return (
        <>
            <PagesHeader />
            <div className="flex-1 px-6 pb-6 2xl:container sm:px-10 lg:px-12 2xl:mx-auto 2xl:px-0">
            <h1 className="mb-8 text-3xl font-black lg:text-5xl">Chicken Posts</h1>
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {loading ? 'Loading...' : ''}
                {error ? 'Error...' : ''}
                {!loading && !error && data?.posts?.map((post, idx) => {
                    const embeddedData = post._embedded as any
                    // todo: add wp:featuredmedia to core headstartwp types, so this 'any' solution isn't needed

                    return (
                        <BlogPostCard
                            blogPost={{
                                author: post?.author?.[0]?.name || null,
                                entityId: post.id,
                                htmlBody: post.content.rendered || "",
                                name: post.title.rendered || "",
                                path: `/wordpress-blog/${post.slug}`,
                                // todo: find way to query plain test excerpt from WP
                                plainTextSummary: post.excerpt.rendered
                                    ?.replace(/(<([^>]+)>)/gi, "")
                                    .replaceAll("&#8230;","...")
                                    .replaceAll("&#8217;","'")
                                    .replaceAll("Continue Reading","") || "",
                                publishedDate: { utc: post.date_gmt },
                                thumbnailImage: { 
                                    altText: embeddedData?.['wp:featuredmedia']?.[0]?.alt_text,
                                    url: embeddedData?.['wp:featuredmedia']?.[0]?.source_url
                                },
                                seo: {
                                    metaKeywords: post?.terms?.post_tag?.map((term) => term.name).join(",") || "",
                                    metaDescription: post?.yoast_head_json?.description,
                                    pageTitle: post?.title?.rendered || ""
                                }
                            }}
                            key={`blog${idx}`}
                        />
                    )
                })}
            </div>
            </div>
            <Footer />
        </>
    );
};

export default ArchivePage;

// Static props fails on the live site because the plugin has localhost:3000 in the settings
// (tried passing props directly to page component above but it only gets the fallback data)
export const getStaticProps: HeadlessGetStaticProps = async (context) => {
	try {
		// fetch batch of promises and throws errors selectively
		// passing `throw:false` will prevent errors from being thrown for that promise
		const settledPromises = await resolveBatch([
			{
                func: fetchHookData(usePosts.fetcher(), context),
			},
			{ func: fetchHookData(useAppSettings.fetcher(), context), throw: false },
		]);

		return addHookData(settledPromises, { revalidate: 5 * 60 });
	} catch (e: any) {
    // Todo: add proper type to e
		return handleError(e, context);
	}
};

// export const getServerSideProps: HeadlessGetServerSideProps = async (context) => {
// 	try {
// 		const settledPromises = await resolveBatch([
// 			{
// 				func: fetchHookData(usePosts.fetcher(), context),
// 			},
// 			{ func: fetchHookData(useAppSettings.fetcher(), context), throw: false },
// 		]);

// 		/**
// 		 * It is also possible to get the queried object on the server, this is useful if you need to conditionally fetch data
// 		 * server side based on queriedObject
// 		 *
// 		 * const [posts] = settledPromises;
// 		 * console.log(posts.data.queriedObject.term.slug);
// 		 */
// 		return addHookData(settledPromises, {});
// 	} catch (e: any) {
//         // Todo: add proper type to e
// 		return handleError(e, context);
// 	}
// };
