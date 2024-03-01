import { Footer } from '~/components/footer/client';
import { PagesHeader } from '~/components/header/client';

import { getWPUrl, removeSourceUrl } from '@headstartwp/core';
import {
	usePost,
	fetchHookData,
	addHookData,
	handleError,
	usePosts,
	useAppSettings,
	HeadlessGetStaticProps,
} from '@headstartwp/next';
import { FC } from 'react';
import { PageContent } from '../../components/headstartwp/PageContent';
import { singleParams } from '../../lib/params';
import { resolveBatch } from '../../lib/promises';

const SinglePostsPage: FC = () => {
	const { loading, error } = usePost(singleParams);

	if (loading) {
		return <>Loading...</>;
	}

	if (error) {
		return <>error...</>;
	}

	return (
    <>
      <PagesHeader />
      <PageContent params={singleParams} />
      <Footer />
    </>
	);
};

export default SinglePostsPage;

/**
 * This is an example of pre-rendering a set of pages at build times.
 * In this specific example, we are pre-rendering the first 50 posts (within dates in the URL) and the first 50 pages.
 *
 * @returns {Promise<*>}
 */
export async function getStaticPaths() {
  // Todo: add proper type
	let postsPath: any[] = [];

	try {
		const postsData = await usePosts.fetcher().get({ postType: 'post', per_page: 50 });
		postsPath = postsData.result.map(({ link }) => {
			return {
				// path is the catch all route, so it must be array with url segments
				// if you don't want to support date urls just remove the date from the path
				params: {
					path: removeSourceUrl({ link, backendUrl: getWPUrl() }).substring(1).split('/'),
				},
			};
		});
	} catch (e) {
		// no posts found
	}

  // Todo: add proper type
	let pagePaths: any = [];

	try {
		const pagesData = await usePosts.fetcher().get({ postType: 'page', per_page: 50 });

		pagePaths = pagesData.result
			.map(({ link }) => {
				const normalizedLink = removeSourceUrl({ link, backendUrl: getWPUrl() });

				if (normalizedLink === '/') {
					return false;
				}

				return {
					// path is the catch all route, so it must be array with url segments
					params: {
						path: normalizedLink.substring(1).split('/'),
					},
				};
			})
			.filter(Boolean);
	} catch (e) {
		// no pages found
	}

	return {
		paths: [...postsPath, ...pagePaths],
		fallback: 'blocking',
	};
}

export const getStaticProps: HeadlessGetStaticProps = async (context) => {
	try {
		// fetch batch of promises and throws errors selectively
		// passing `throw:false` will prevent errors from being thrown for that promise
		const settledPromises = await resolveBatch([
			{
				func: fetchHookData(usePost.fetcher(), context, { params: singleParams }),
			},
			{ func: fetchHookData(useAppSettings.fetcher(), context), throw: false },
		]);

		return addHookData(settledPromises, { revalidate: 5 * 60 });
	} catch (e: any) {
    // Todo: add proper type to e
		return handleError(e, context);
	}
};
