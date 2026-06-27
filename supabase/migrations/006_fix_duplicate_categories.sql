-- Remove duplicate categories — keep the first occurrence by lowest sort_order
-- Duplicates identified in audit: short-interest, news-wire, ir-website, social-media-mgmt

-- For any slug that appears more than once, delete all but the one with the lowest sort_order
delete from service_categories
where id in (
  select id from (
    select id,
           row_number() over (partition by slug order by sort_order asc) as rn
    from service_categories
  ) ranked
  where rn > 1
);

-- Verify
select slug, count(*) as cnt from service_categories group by slug having count(*) > 1;
