'use client';

import { ChevronDown, User } from 'lucide-react';

import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@bigcommerce/components/navigation-menu';
import { getCategoryTree } from '~/client/queries/get-category-tree';
import { Link } from '~/components/link';
import { cn } from '~/lib/utils';

type CategoryTree = Awaited<ReturnType<typeof getCategoryTree>>;

export const BaseHeaderNav = ({
  className,
  inCollapsedNav = false,
  categoryTree,
}: {
  className?: string;
  inCollapsedNav?: boolean;
  categoryTree: CategoryTree;
}) => {
  return (
    <>
      <NavigationMenuList
        className={cn(
          !inCollapsedNav && 'lg:gap-4',
          inCollapsedNav && 'flex-col items-start pb-6',
          className,
        )}
      >
        {categoryTree.map((category) => (
          <NavigationMenuItem className={cn(inCollapsedNav && 'w-full')} key={category.path}>
            {category.children.length > 0 ? (
              <>
                <NavigationMenuTrigger className="gap-0 p-0">
                  <>
                    <NavigationMenuLink asChild>
                      <Link className="grow" href={category.path}>
                        {category.name}
                      </Link>
                    </NavigationMenuLink>
                    <span className={cn(inCollapsedNav && 'p-3')}>
                      <ChevronDown
                        aria-hidden="true"
                        className={cn(
                          'cursor-pointer transition duration-200 group-data-[state=open]/button:-rotate-180',
                        )}
                      />
                    </span>
                  </>
                </NavigationMenuTrigger>
                <NavigationMenuContent
                  className={cn(
                    !inCollapsedNav && 'mx-auto flex w-[700px] flex-row gap-20',
                    inCollapsedNav && 'ps-3',
                  )}
                >
                  {category.children.map((childCategory1) => (
                    <ul className={cn(inCollapsedNav && 'pb-4')} key={childCategory1.entityId}>
                      <NavigationMenuItem>
                        <NavigationMenuLink href={childCategory1.path}>
                          {childCategory1.name}
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                      {childCategory1.children.map((childCategory2) => (
                        <NavigationMenuItem key={childCategory2.entityId}>
                          <NavigationMenuLink className="font-normal" href={childCategory2.path}>
                            {childCategory2.name}
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      ))}
                    </ul>
                  ))}
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink asChild>
                <Link href={category.path}>{category.name}</Link>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
        <NavigationMenuLink asChild>
                      <Link className="grow" href={`/wordpress-blog`}>
                        Blog
                      </Link>
                    </NavigationMenuLink>
      </NavigationMenuList>
      <NavigationMenuList
        className={cn(
          'border-t border-gray-200 pt-6 lg:hidden',
          !inCollapsedNav && 'hidden',
          inCollapsedNav && 'flex-col items-start',
        )}
      >
        <NavigationMenuItem className={cn(inCollapsedNav && 'w-full')}>
          <NavigationMenuLink href="/login">
            Your Account <User />
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </>
  );
};
