import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import type { PublicProfile } from "../api";
import { QUICK_FILTER_LABEL, type NearbyNavigationState, type QuickFilterKey } from "../features/nearby/quickFilter";

type CoverProps = {
  photos: string[];
  displayName: string;
  age: number;
  status?: Pick<PublicProfile, "online" | "recent" | "distance">;
  back?: ReactNode;
};

export function ProfileCover({ photos, displayName, age, status, back }: CoverProps) {
  const [selected, setSelected] = useState(0);
  const index = Math.min(selected, photos.length - 1);
  return (
    <div className="profile__photo">
      {photos.length ? (
        <img src={photos[index]} alt={`Foto de ${displayName}`} />
      ) : (
        <div className="profile__nophoto">{displayName.charAt(0).toUpperCase()}</div>
      )}
      {back}
      {photos.length > 1 && (
        <div className={back ? "profile__dots profile__dots--with-back" : "profile__dots"}>
          {photos.map((_, i) => (
            <button key={i} aria-label={`Foto ${i + 1}`} aria-current={i === index ? "true" : undefined} className={i === index ? "on" : ""} onClick={() => setSelected(i)} />
          ))}
        </div>
      )}
      {photos.length > 1 && (
        <>
          <button className="profile__tap profile__tap--prev" aria-label="Foto anterior" onClick={() => setSelected((index - 1 + photos.length) % photos.length)} />
          <button className="profile__tap profile__tap--next" aria-label="Foto siguiente" onClick={() => setSelected((index + 1) % photos.length)} />
        </>
      )}
      <div className="profile__name">
        <div className="profile__nameline">
          <h1>{displayName}</h1>
          <span>{age}</span>
        </div>
        {(status && (status.online || status.recent || status.distance)) && (
          <p className="profile__status">
            {status.online ? <><i className="dot dot--on" /> En línea</> : status.recent ? <><i className="dot dot--recent" /> Hace un rato</> : null}
            {(status.online || status.recent) && status.distance && " · "}
            {status.distance}
          </p>
        )}
      </div>
    </div>
  );
}

type StatsInput = Pick<PublicProfile, "about" | "heightCm" | "weightKg" | "bodyType" | "position" | "relationship" | "pronouns" | "hivStatus" | "lastTested" | "tribes" | "lookingFor">;

function FilterBadges({ filterKey, values }: { filterKey: QuickFilterKey; values: string[] }) {
  const navigate = useNavigate();
  const openNearby = (value: string) => {
    const state: NearbyNavigationState = { quickFilter: { key: filterKey, value } };
    navigate("/cerca", { state });
  };
  return (
    <div className="chips">
      {values.map((value) => (
        <button key={value} type="button" className="chip chip--link" aria-label={QUICK_FILTER_LABEL[filterKey](value)} onClick={() => openNearby(value)}>
          {value}
        </button>
      ))}
    </div>
  );
}

export function ProfileStats({ p, empty = null }: { p: StatsInput; empty?: ReactNode }) {
  const rows: [string, string | null][] = [
    ["Altura", p.heightCm ? `${p.heightCm} cm` : null],
    ["Peso", p.weightKg ? `${p.weightKg} kg` : null],
    ["Contextura", p.bodyType],
    ["Rol", p.position],
    ["Relación", p.relationship],
    ["Pronombres", p.pronouns],
    ["Estado serológico", p.hivStatus],
    ["Último test", p.lastTested ? new Date(p.lastTested + "T12:00").toLocaleDateString("es-AR", { month: "long", year: "numeric" }) : null],
  ];
  const visible = rows.filter(([, v]) => v);
  if (!p.about && !visible.length && !p.tribes.length && !p.lookingFor.length) return empty;
  return (
    <>
      {p.about && <p className="profile__about">{p.about}</p>}
      {visible.length > 0 && (
        <dl className="stats">
          {visible.map(([k, v]) => (
            <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
      )}
      {p.tribes.length > 0 && (
        <section className="profile__section">
          <h3>Tribus</h3>
          <FilterBadges filterKey="tribes" values={p.tribes} />
        </section>
      )}
      {p.lookingFor.length > 0 && (
        <section className="profile__section">
          <h3>Busca</h3>
          <FilterBadges filterKey="lookingFor" values={p.lookingFor} />
        </section>
      )}
    </>
  );
}
