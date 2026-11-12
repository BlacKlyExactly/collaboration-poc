import { useSearchParams } from 'react-router-dom';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@notes-app/ui';
import { slidingWindowPagination } from '../utils';

export function UrlPagination({ totalPages }: { totalPages: number }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.min(
    Math.max(Number(searchParams.get('page')) || 1, 1),
    totalPages,
  );

  const goTo = (e: React.MouseEvent, target: number) => {
    e.preventDefault();
    setSearchParams((prev) => {
      prev.set('page', String(target));
      return prev;
    });
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            size="sm"
            href={`?page=${Math.max(page - 1, 1)}`}
            onClick={(e) => goTo(e, Math.max(page - 1, 1))}
          />
        </PaginationItem>

        {slidingWindowPagination(totalPages, page, 1).map((item, i) =>
          item === 'ellipsis' ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                size="icon"
                href={`?page=${item}`}
                isActive={item === page}
                onClick={(e) => goTo(e, item)}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            size="sm"
            href={`?page=${Math.min(page + 1, totalPages)}`}
            onClick={(e) => goTo(e, Math.min(page + 1, totalPages))}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
