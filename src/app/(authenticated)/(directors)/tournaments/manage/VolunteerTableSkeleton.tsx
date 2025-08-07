import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/shadcn/table";
import { Skeleton } from "@/components/shadcn/skeleton";

export default function SkeletonTable() {
  const skeletonRows = Array.from({ length: 10 });

  return (
    <div>
      <div className="rounded-md border  overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Education</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skeletonRows.map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-48" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Skeleton className="w-[76.15px] h-[30px] rounded-md" />
        <Skeleton className="w-[53px] h-[30px] rounded-md" />
      </div>
    </div>
  );
}
