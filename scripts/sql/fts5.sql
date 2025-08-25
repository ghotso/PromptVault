-- Enable FTS5 virtual table for prompts (title, body, tags)
-- Contentless table with manual synchronization via triggers

CREATE VIRTUAL TABLE IF NOT EXISTS PromptSearch USING fts5(
  pid,        -- prompt id (text)
  title,
  body,
  tags,
  content=''
);

-- Helper: compute tag list for a prompt
-- We will inline this logic in triggers via a GROUP_CONCAT subquery

-- Seed existing rows
INSERT INTO PromptSearch(pid, title, body, tags)
SELECT p.id, p.title, p.body,
  COALESCE((
    SELECT group_concat(t.name, ' ')
    FROM PromptTag pt
    JOIN Tag t ON t.id = pt.tagId
    WHERE pt.promptId = p.id
  ), '') AS tags
FROM Prompt p;

-- Triggers for Prompt
CREATE TRIGGER IF NOT EXISTS trg_prompt_ai AFTER INSERT ON Prompt BEGIN
  INSERT INTO PromptSearch(pid, title, body, tags)
  VALUES (
    new.id,
    new.title,
    new.body,
    COALESCE((
      SELECT group_concat(t.name, ' ')
      FROM PromptTag pt
      JOIN Tag t ON t.id = pt.tagId
      WHERE pt.promptId = new.id
    ), '')
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_prompt_au AFTER UPDATE ON Prompt BEGIN
  DELETE FROM PromptSearch WHERE pid = old.id;
  INSERT INTO PromptSearch(pid, title, body, tags)
  VALUES (
    new.id,
    new.title,
    new.body,
    COALESCE((
      SELECT group_concat(t.name, ' ')
      FROM PromptTag pt
      JOIN Tag t ON t.id = pt.tagId
      WHERE pt.promptId = new.id
    ), '')
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_prompt_ad AFTER DELETE ON Prompt BEGIN
  DELETE FROM PromptSearch WHERE pid = old.id;
END;

-- Triggers for PromptTag to keep tags column in sync
CREATE TRIGGER IF NOT EXISTS trg_prompttag_ai AFTER INSERT ON PromptTag BEGIN
  DELETE FROM PromptSearch WHERE pid = new.promptId;
  INSERT INTO PromptSearch(pid, title, body, tags)
  SELECT p.id, p.title, p.body,
    COALESCE((
      SELECT group_concat(t2.name, ' ')
      FROM PromptTag pt2
      JOIN Tag t2 ON t2.id = pt2.tagId
      WHERE pt2.promptId = p.id
    ), '') AS tags
  FROM Prompt p WHERE p.id = new.promptId;
END;

CREATE TRIGGER IF NOT EXISTS trg_prompttag_ad AFTER DELETE ON PromptTag BEGIN
  DELETE FROM PromptSearch WHERE pid = old.promptId;
  INSERT INTO PromptSearch(pid, title, body, tags)
  SELECT p.id, p.title, p.body,
    COALESCE((
      SELECT group_concat(t2.name, ' ')
      FROM PromptTag pt2
      JOIN Tag t2 ON t2.id = pt2.tagId
      WHERE pt2.promptId = p.id
    ), '') AS tags
  FROM Prompt p WHERE p.id = old.promptId;
END;


