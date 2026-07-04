-- Chạy lệnh sau trong thư mục chứa file docker-compose.yml để import dữ liệu:
-- docker exec -i travel_app_postgres psql -U postgres -d travel_app < seed-data.sql

---------------------------------------------------------
-- 1. Xóa dữ liệu cũ (Tùy chọn, để tránh trùng lặp)
---------------------------------------------------------
TRUNCATE TABLE place_category_mappings, places, place_categories CASCADE;

---------------------------------------------------------
-- 2. Bảng place_categories
---------------------------------------------------------
INSERT INTO place_categories (id, name, thumbnail_url, description, created_at, updated_at) VALUES
('c0000000-0000-0000-0000-000000000001', 'Thiên nhiên', 'https://example.com/nature.jpg', 'Phong cảnh thiên nhiên hùng vĩ và tuyệt đẹp', NOW(), NOW()),
('c0000000-0000-0000-0000-000000000002', 'Văn hóa', 'https://example.com/culture.jpg', 'Các di tích lịch sử và văn hóa truyền thống', NOW(), NOW()),
('c0000000-0000-0000-0000-000000000003', 'Khám phá', 'https://example.com/adventure.jpg', 'Các hoạt động khám phá và mạo hiểm thú vị', NOW(), NOW()),
('c0000000-0000-0000-0000-000000000004', 'Nghỉ dưỡng', 'https://example.com/relax.jpg', 'Các điểm đến yên bình để thư giãn', NOW(), NOW()),
('c0000000-0000-0000-0000-000000000005', 'Thành thị', 'https://example.com/urban.jpg', 'Khám phá sự nhộn nhịp của các thành phố hiện đại', NOW(), NOW());

---------------------------------------------------------
-- 3. Bảng places
---------------------------------------------------------
INSERT INTO places (id, name, description, location, image, content, status, created_at, updated_at) VALUES
('p0000000-0000-0000-0000-000000000001', 'Vịnh Hạ Long', 'Di sản thiên nhiên thế giới được UNESCO công nhận.', 'Quảng Ninh, Việt Nam', 'https://example.com/halong.jpg', '<p>Vịnh Hạ Long nổi bật với hàng ngàn hòn đảo đá vôi kỳ vĩ muôn hình vạn trạng trên mặt nước xanh biếc.</p>', 'active', NOW(), NOW()),
('p0000000-0000-0000-0000-000000000002', 'Phố cổ Hội An', 'Bản sắc giao thương quốc tế một thời của Đông Nam Á.', 'Quảng Nam, Việt Nam', 'https://example.com/hoian.jpg', '<p>Nổi tiếng với những chiếc lồng đèn rực rỡ, kiến trúc cổ kính và những tiệm may đo lấy liền.</p>', 'active', NOW(), NOW()),
('p0000000-0000-0000-0000-000000000003', 'Động Phong Nha', 'Hệ thống hang động kỳ vĩ.', 'Quảng Bình, Việt Nam', 'https://example.com/phongnha.jpg', '<p>Vườn quốc gia với những dãy núi đá vôi cổ nhất ở châu Á và vô số nhũ đá tuyệt đẹp.</p>', 'active', NOW(), NOW()),
('p0000000-0000-0000-0000-000000000004', 'Sa Pa', 'Thị trấn mù sương với những thửa ruộng bậc thang bát ngát.', 'Lào Cai, Việt Nam', 'https://example.com/sapa.jpg', '<p>Được biết đến với sự đa dạng văn hóa của các dân tộc thiểu số và cảnh quan núi rừng hùng vĩ.</p>', 'active', NOW(), NOW()),
('p0000000-0000-0000-0000-000000000005', 'Đà Nẵng', 'Thành phố đáng sống với những bãi biển đẹp và những cây cầu độc đáo.', 'Đà Nẵng, Việt Nam', 'https://example.com/danang.jpg', '<p>Sở hữu Cầu Rồng nổi tiếng và bãi biển Mỹ Khê tuyệt đẹp cùng dịch vụ du lịch phát triển.</p>', 'active', NOW(), NOW()),
('p0000000-0000-0000-0000-000000000006', 'Đảo Phú Quốc', 'Thiên đường nhiệt đới với những bãi cát trắng trải dài.', 'Kiên Giang, Việt Nam', 'https://example.com/phuquoc.jpg', '<p>Hòn đảo lớn nhất Việt Nam, là điểm đến hoàn hảo cho những kỳ nghỉ dưỡng biển.</p>', 'active', NOW(), NOW()),
('p0000000-0000-0000-0000-000000000007', 'Đỉnh Fansipan', 'Nóc nhà của Đông Dương.', 'Lào Cai, Việt Nam', 'https://example.com/fansipan.jpg', '<p>Trải nghiệm leo núi đầy thử thách hoặc chuyến đi cáp treo ngắm nhìn toàn cảnh Tây Bắc.</p>', 'active', NOW(), NOW()),
('p0000000-0000-0000-0000-000000000008', 'Cố đô Huế', 'Kinh đô xưa của triều đại phong kiến Việt Nam.', 'Thừa Thiên Huế, Việt Nam', 'https://example.com/hue.jpg', '<p>Nơi tọa lạc của Đại Nội, các lăng tẩm hoàng gia và dòng sông Hương thơ mộng.</p>', 'active', NOW(), NOW()),
('p0000000-0000-0000-0000-000000000009', 'Thành phố Hồ Chí Minh', 'Trung tâm kinh tế sôi động nhất Việt Nam.', 'Hồ Chí Minh, Việt Nam', 'https://example.com/hcmc.jpg', '<p>Một đô thị nhộn nhịp với các công trình kiến trúc thời Pháp thuộc và các tòa nhà chọc trời hiện đại.</p>', 'active', NOW(), NOW()),
('p0000000-0000-0000-0000-000000000010', 'Phố cổ Hà Nội', 'Trái tim lịch sử của thủ đô.', 'Hà Nội, Việt Nam', 'https://example.com/hanoi.jpg', '<p>Nổi tiếng với khu 36 phố phường, mỗi con phố mang một nét đặc trưng về một ngành nghề thủ công xưa.</p>', 'active', NOW(), NOW()),
('p0000000-0000-0000-0000-000000000011', 'Quần thể Tràng An', 'Khu du lịch sinh thái và cảnh quan tuyệt sắc.', 'Ninh Bình, Việt Nam', 'https://example.com/ninhbinh.jpg', '<p>Được mệnh danh là Vịnh Hạ Long trên cạn với những ngọn núi đá vôi và thung lũng xen kẽ.</p>', 'active', NOW(), NOW()),
('p0000000-0000-0000-0000-000000000012', 'Bà Nà Hills', 'Khu nghỉ dưỡng trên mây với Cầu Vàng nổi tiếng.', 'Đà Nẵng, Việt Nam', 'https://example.com/banahills.jpg', '<p>Mang đến trải nghiệm lạc vào Làng Pháp và chiêm ngưỡng Cầu Vàng được nâng đỡ bởi đôi bàn tay khổng lồ.</p>', 'active', NOW(), NOW()),
('p0000000-0000-0000-0000-000000000013', 'Mũi Né', 'Thủ phủ resort ven biển nổi tiếng với những đồi cát bay.', 'Bình Thuận, Việt Nam', 'https://example.com/muine.jpg', '<p>Điểm đến hấp dẫn cho các tín đồ lướt ván diều và khám phá đồi cát trắng, đồi cát đỏ.</p>', 'active', NOW(), NOW()),
('p0000000-0000-0000-0000-000000000014', 'Côn Đảo', 'Quần đảo nổi tiếng với hệ sinh thái biển và di tích lịch sử.', 'Bà Rịa - Vũng Tàu, Việt Nam', 'https://example.com/condao.jpg', '<p>Những bãi biển hoang sơ tuyệt đẹp bên cạnh quá khứ hào hùng của di tích nhà tù Côn Đảo.</p>', 'active', NOW(), NOW()),
('p0000000-0000-0000-0000-000000000015', 'Đà Lạt', 'Thành phố ngàn hoa của mùa xuân vĩnh cửu.', 'Lâm Đồng, Việt Nam', 'https://example.com/dalat.jpg', '<p>Điểm nghỉ dưỡng lãng mạn bao quanh bởi những đồi thông mờ sương và các thác nước thơ mộng.</p>', 'active', NOW(), NOW()),
('p0000000-0000-0000-0000-000000000016', 'Thánh địa Mỹ Sơn', 'Quần thể di tích đền tháp Chăm Pa cổ kính.', 'Quảng Nam, Việt Nam', 'https://example.com/myson.jpg', '<p>Được xây dựng từ thế kỷ 4 đến thế kỷ 14 bởi các vị vua của vương quốc Chăm Pa cổ đại.</p>', 'active', NOW(), NOW()),
('p0000000-0000-0000-0000-000000000017', 'Thác Bản Giốc', 'Ngọn thác hùng vĩ nằm trên biên giới tự nhiên.', 'Cao Bằng, Việt Nam', 'https://example.com/bangioc.jpg', '<p>Một trong những thác nước tự nhiên xuyên biên giới lớn nhất thế giới với vẻ đẹp tráng lệ.</p>', 'active', NOW(), NOW()),
('p0000000-0000-0000-0000-000000000018', 'Hang Sơn Đoòng', 'Hang động tự nhiên lớn nhất hành tinh.', 'Quảng Bình, Việt Nam', 'https://example.com/sondoong.jpg', '<p>Một hang động khổng lồ sở hữu cả một hệ sinh thái rừng rậm và hệ thống thời tiết riêng biệt bên trong.</p>', 'active', NOW(), NOW()),
('p0000000-0000-0000-0000-000000000019', 'Địa đạo Củ Chi', 'Hệ thống hầm ngầm kháng chiến rộng lớn.', 'Hồ Chí Minh, Việt Nam', 'https://example.com/cuchi.jpg', '<p>Căn cứ bí mật với mạng lưới địa đạo chằng chịt, được quân giải phóng sử dụng trong chiến tranh.</p>', 'active', NOW(), NOW()),
('p0000000-0000-0000-0000-000000000020', 'Nha Trang', 'Thành phố biển nghỉ dưỡng sôi động.', 'Khánh Hòa, Việt Nam', 'https://example.com/nhatrang.jpg', '<p>Nổi tiếng với vịnh biển đẹp mê hồn, các hòn đảo ngoài khơi và hoạt động lặn ngắm san hô.</p>', 'active', NOW(), NOW());

---------------------------------------------------------
-- 4. Bảng place_category_mappings
---------------------------------------------------------
INSERT INTO place_category_mappings (place_id, category_id) VALUES
-- Vịnh Hạ Long (Thiên nhiên, Nghỉ dưỡng)
('p0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001'),
('p0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000004'),
-- Phố cổ Hội An (Văn hóa)
('p0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002'),
-- Động Phong Nha (Thiên nhiên, Khám phá)
('p0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001'),
('p0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000003'),
-- Sa Pa (Thiên nhiên, Văn hóa)
('p0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001'),
('p0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000002'),
-- Đà Nẵng (Thành thị, Nghỉ dưỡng)
('p0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000004'),
('p0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000005'),
-- Đảo Phú Quốc (Nghỉ dưỡng, Thiên nhiên)
('p0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000001'),
('p0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000004'),
-- Đỉnh Fansipan (Khám phá, Thiên nhiên)
('p0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000001'),
('p0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000003'),
-- Cố đô Huế (Văn hóa)
('p0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000002'),
-- TP. Hồ Chí Minh (Thành thị)
('p0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000005'),
-- Phố cổ Hà Nội (Văn hóa, Thành thị)
('p0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000002'),
('p0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000005'),
-- Quần thể Tràng An (Thiên nhiên)
('p0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000001'),
-- Bà Nà Hills (Thành thị, Nghỉ dưỡng)
('p0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000004'),
('p0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000005'),
-- Mũi Né (Nghỉ dưỡng, Khám phá)
('p0000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000003'),
('p0000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000004'),
-- Côn Đảo (Nghỉ dưỡng, Thiên nhiên)
('p0000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000001'),
('p0000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000004'),
-- Đà Lạt (Thiên nhiên, Nghỉ dưỡng)
('p0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000001'),
('p0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000004'),
-- Thánh địa Mỹ Sơn (Văn hóa)
('p0000000-0000-0000-0000-000000000016', 'c0000000-0000-0000-0000-000000000002'),
-- Thác Bản Giốc (Thiên nhiên)
('p0000000-0000-0000-0000-000000000017', 'c0000000-0000-0000-0000-000000000001'),
-- Hang Sơn Đoòng (Khám phá)
('p0000000-0000-0000-0000-000000000018', 'c0000000-0000-0000-0000-000000000003'),
-- Địa đạo Củ Chi (Văn hóa)
('p0000000-0000-0000-0000-000000000019', 'c0000000-0000-0000-0000-000000000002'),
-- Nha Trang (Nghỉ dưỡng, Thành thị)
('p0000000-0000-0000-0000-000000000020', 'c0000000-0000-0000-0000-000000000004'),
('p0000000-0000-0000-0000-000000000020', 'c0000000-0000-0000-0000-000000000005');
