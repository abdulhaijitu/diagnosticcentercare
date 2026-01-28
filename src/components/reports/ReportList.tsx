import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useReports, Report } from "@/hooks/useReports";
import { FileText, Download, Loader2, Eye } from "lucide-react";
import { format } from "date-fns";

interface ReportListProps {
  requestId: string;
}

export function ReportList({ requestId }: ReportListProps) {
  const { getReportsForRequest, getReportUrl, isLoading } = useReports();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const reports = getReportsForRequest(requestId);

  const handleDownload = async (report: Report) => {
    setDownloadingId(report.id);
    try {
      const url = await getReportUrl(report.file_path);
      if (url) {
        window.open(url, "_blank");
      }
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading reports...
      </div>
    );
  }

  if (reports.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 pt-4 border-t border-border">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-success" />
        <span className="text-sm font-medium text-foreground">
          Reports Available
        </span>
        <Badge variant="secondary" className="text-xs">
          {reports.length}
        </Badge>
      </div>
      
      <div className="space-y-2">
        {reports.map((report) => (
          <div
            key={report.id}
            className="flex items-center justify-between p-3 bg-success/5 border border-success/20 rounded-lg"
          >
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="h-5 w-5 text-success shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{report.file_name}</p>
                <p className="text-xs text-muted-foreground">
                  Uploaded {format(new Date(report.uploaded_at), "PPp")}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload(report)}
              disabled={downloadingId === report.id}
              className="shrink-0"
            >
              {downloadingId === report.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
