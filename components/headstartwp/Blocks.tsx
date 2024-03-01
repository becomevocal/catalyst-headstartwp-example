import { BlocksRenderer, YoutubeLiteBlock, ImageBlock } from '@headstartwp/core/react';
import { TwitterBlock, ImageComponent, LinkBlock } from '@headstartwp/next';
import { FC } from 'react';

export const Blocks: FC<{ html: string }> = ({ html }) => {
	return (
		<div style={{ position: "relative" }}>
			<BlocksRenderer html={html}>
				<ImageBlock component={ImageComponent} />
				<LinkBlock test={ 
              (node) => node.type === 'tag' 
                    && node.name === 'a' 
                    // added because of invalid url in tropicalchicki content. caused build error in removeSourceUrl()
                    // could be fixed in library?
                    && node?.href?.indexOf('http') === 0
        } />
				<TwitterBlock />
				<YoutubeLiteBlock />
			</BlocksRenderer>
		</div>
	);
};

export default Blocks;