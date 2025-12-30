import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import { Card, CardContent, CardTitle } from '@/components/ui/card';

type Stat = { title: string; count: number };

import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type DotProps = {
    onClick?: () => void;
    active?: boolean;
};

function CarouselDot({ onClick, active }: DotProps) {
    return (
        <button
            onClick={onClick}
            aria-label="carousel-dot"
            className={`mx-1 h-1 w-2 rounded-full transition-all duration-300 ${
                active
                    ? 'bg-foreground'
                    : 'bg-muted-foreground/20 hover:bg-muted-foreground/70'
            } `}
        />
    );
}

type ArrowProps = {
    onClick?: () => void;
    direction: 'left' | 'right';
};

function CarouselArrow({ onClick, direction }: ArrowProps) {
    return (
        <button
            onClick={onClick}
            aria-label={direction === 'left' ? 'Previous' : 'Next'}
            className={cn(
                'absolute z-20 flex h-10 w-10 items-center justify-center rounded-full',
                'bg-background/70 shadow-md backdrop-blur',
                'border border-border',
                'transition hover:scale-105 hover:bg-background',
                direction === 'left'
                    ? 'top-1/2 left-3 -translate-x-15 -translate-y-1/2 group-hover:translate-x-0'
                    : 'top-1/2 right-3 translate-x-15 -translate-y-1/2 group-hover:translate-x-0',
            )}
        >
            {direction === 'left' ? (
                <ChevronLeft className="h-5 w-5 text-foreground" />
            ) : (
                <ChevronRight className="h-5 w-5 text-foreground" />
            )}
        </button>
    );
}

export const CustomLeftArrow = (props: any) => (
    <CarouselArrow {...props} direction="left" />
);

export const CustomRightArrow = (props: any) => (
    <CarouselArrow {...props} direction="right" />
);

const COLORS = [
    '--card-light-1',
    '--card-light-2',
    '--card-light-3',
    '--card-light-4',
    '--card-light-5',
    '--card-light-6',
];

function StatCard({ item, colorVar }: { item: Stat; colorVar: string }) {
    return (
        <Card
            className="h-36 border-none  transition"
            style={{ backgroundColor: `var(${colorVar})` }}
        >
            <CardContent className="flex h-full flex-col justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {item.title}
                </CardTitle>
                <div className="text-3xl font-bold text-card-foreground">
                    {item.count}
                </div>
            </CardContent>
        </Card>
    );
}

const responsive = {
    desktop: {
        breakpoint: { max: 9560, min: 1600 },
        items: 5,
        partialVisibilityGutter: 20,
    },
    laptop: {
        breakpoint: { max: 1600, min: 1024 },
        items: 4,
        partialVisibilityGutter: 20,
    },
    tablet: {
        breakpoint: { max: 1024, min: 640 },
        items: 3,
        partialVisibilityGutter: 16,
    },
    mobile: {
        breakpoint: { max: 640, min: 0 },
        items: 1,
        partialVisibilityGutter: 12,
    },
};

export function StatsCarousel({
    documentsCount,
    groupOwnerName,
    groupOwnerCount,
    groupOwnerDocumentCount,
}: {
    documentsCount: number;
    groupOwnerName: string;
    groupOwnerCount: number;
    groupOwnerDocumentCount:
        | {
              name: string;
              documents_count: number;
          }[]
        | null;
}) {
    // Dummy data (dynamic; min 3)
    const dummyStats: Stat[] = [
        { title: 'Total Dokumen', count: documentsCount },
        { title: groupOwnerName, count: groupOwnerCount },
    ];

    if (groupOwnerDocumentCount) {
        groupOwnerDocumentCount.forEach((item) => {
            dummyStats.push({
                title: 'Total Dokumen - ' + item.name,
                count: item.documents_count,
            });
        });
    }
    
    const stats = dummyStats.length >= 3 ? dummyStats : dummyStats.slice(0, 3);
    return (
        <div className="w-full">
            <Carousel
                responsive={responsive}
                arrows
                customLeftArrow={<CustomLeftArrow />}
                customRightArrow={<CustomRightArrow />}
                draggable
                swipeable
                focusOnSelect
                infinite={stats.length > 4}
                customDot={<CarouselDot />}
                removeArrowOnDeviceType={['mobile']}
                keyBoardControl
                showDots={stats.length > 4}
                dotListClass="!pb-3"
                renderDotsOutside
                itemClass="px-2"
            >
                {stats.map((item, i) => (
                    <div key={item.title} className="h-full">
                        <StatCard
                            item={item}
                            colorVar={COLORS[i % COLORS.length]}
                        />

                    </div>
                ))}
            </Carousel>
        </div>
    );
}
