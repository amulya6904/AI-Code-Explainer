import { useCallback, useEffect, useState } from "react";
import { getStudyTopicContent } from "../api/client";

export function useStudyContent(chapterId) {
  const [content, setContent] = useState(null);
  const [status, setStatus] = useState("loading");
  const [requestId, setRequestId] = useState(0);

  useEffect(() => {
    if (!chapterId) {
      setContent(null);
      setStatus("loading");
      return undefined;
    }

    let cancelled = false;
    setStatus("loading");

    getStudyTopicContent(chapterId)
      .then((data) => {
        if (cancelled) return;
        setContent(data);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to load study content:", err);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [chapterId, requestId]);

  const reload = useCallback(() => setRequestId((value) => value + 1), []);

  return { content, status, reload };
}
