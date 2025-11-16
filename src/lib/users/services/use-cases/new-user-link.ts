import { logger } from "@/index";
import { UserLinkRepository } from "../../interfaces/user-links/repository";
import { UserLinksDrizzleRepository } from "../repositories/user-links.repository";
import { NewLinkDTO } from "../../interfaces/user-links/dtos/new-user-link.dto";
import { PLATFORM_BASE_URLS } from "../../interfaces/user-links/platforms";
import { UserLinkValidator } from "../validators/user-link.validator";
import { ApplicationError } from "@/core/types/application-errors";

export class NewUserLink {
  constructor(
    private readonly _logger = logger,
    private readonly validator = new UserLinkValidator(),
    private readonly userLinkRepo: UserLinkRepository = new UserLinksDrizzleRepository(),
  ) {}
  // No es la mejor forma
  // Traer todos los links
  // Buscar links existentes
  // clasificar el dto
  // ejecutar todo en paralelo
  async execute(user_id: number, links: NewLinkDTO[]) {
    if (!user_id) {
      throw new ApplicationError(
        "INVALID_USER_ID",
        "El user_id es requerido",
        400,
      );
    }

    if (!Array.isArray(links) || links.length === 0) {
      throw new ApplicationError(
        "NO_LINKS",
        "Debes enviar al menos un link",
        400,
      );
    }

    const results = [];

    for (const link of links) {
      this.validator.validate(link);

      const { platform, username } = link;

      const baseUrl = PLATFORM_BASE_URLS[platform];
      const finalLink = `${baseUrl}${username}`;

      const existing = await this.userLinkRepo.search({
        user_id,
        platform,
      });

      let saved;

      if (existing.length > 0) {
        saved = await this.userLinkRepo.update(existing[0].id, {
          platform,
          link: finalLink,
          user_id,
        });
      } else {
        saved = await this.userLinkRepo.save({
          platform,
          link: finalLink,
          user_id,
        });
      }

      results.push(saved);
    }

    return results.map((l) => {
      const { id, user_id, ...rest } = l;
      return rest;
    });
  }
}
