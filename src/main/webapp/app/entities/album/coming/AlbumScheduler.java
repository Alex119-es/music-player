import java.time.LocalDate;
import java.util.List;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class AlbumScheduler {

    private final AlbumRepository albumRepository;

    public AlbumScheduler(AlbumRepository albumRepository) {
        this.albumRepository = albumRepository;
    }

    @Scheduled(cron = "0 0 * * * *") // cada hora
    public void activateAlbums() {
        LocalDate today = LocalDate.now();

        List<Album> albums = albumRepository.findByActiveFalseAndReleaseDateLessThanEqual(today);

        for (Album album : albums) {
            album.setActive(true);
        }

        albumRepository.saveAll(albums);
    }
}
